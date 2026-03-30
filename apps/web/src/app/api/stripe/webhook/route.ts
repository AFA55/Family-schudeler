import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@familysync/database";
import {
  calculateCharityContribution,
  mapStripeStatus,
  mapStripePlan,
} from "@/lib/services/stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

// POST /api/stripe/webhook - Handle Stripe webhook events
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook error: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }
    }
  } catch (error) {
    console.error(`Error handling webhook ${event.type}:`, error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

// --- Webhook Handlers ---

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode !== "subscription" || !session.subscription) return;

  const customerId = session.customer as string;

  // Find user by Stripe customer ID
  const existingSub = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!existingSub) {
    // Find user from customer metadata
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return;

    const userId = customer.metadata?.userId;
    if (!userId) return;

    const sub = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.subscription.create({
      data: {
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: sub.id,
        plan: mapStripePlan(sub.items.data[0]?.price.id || ""),
        status: mapStripeStatus(sub.status),
        trialEndsAt: sub.trial_end
          ? new Date(sub.trial_end * 1000)
          : null,
        currentPeriodStart: new Date(sub.current_period_start * 1000),
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
      },
    });
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const sub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!sub) return;

  await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      plan: mapStripePlan(subscription.items.data[0]?.price.id || ""),
      status: mapStripeStatus(subscription.status),
      trialEndsAt: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      currentPeriodStart: new Date(
        subscription.current_period_start * 1000
      ),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: "CANCELED",
      cancelAtPeriodEnd: false,
    },
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.amount_paid || invoice.amount_paid === 0) return;

  const contribution = calculateCharityContribution(invoice.amount_paid);

  // Find user's subscription to get their charity preference
  const sub = await prisma.subscription.findFirst({
    where: { stripeCustomerId: invoice.customer as string },
    include: { user: { include: { onboarding: true } } },
  });

  if (!sub) return;

  const helpPreference =
    sub.user.onboarding?.helpCountryPreference?.[0] || "GLOBAL";

  // Find a charity organization matching the user's preference
  const org = await prisma.charityOrganization.findFirst({
    where: {
      isActive: true,
      countries: { has: helpPreference },
    },
  });

  if (org && contribution.charityAmount > 0) {
    await prisma.charityContribution.create({
      data: {
        amount: contribution.charityAmount,
        organizationId: org.id,
        country: helpPreference,
        period: new Date().toISOString().slice(0, 7), // "2026-03"
        stripePaymentId: invoice.payment_intent as string,
      },
    });
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const sub = await prisma.subscription.findFirst({
    where: { stripeCustomerId: invoice.customer as string },
  });

  if (!sub) return;

  // Create a notification for the user
  await prisma.notification.create({
    data: {
      userId: sub.userId,
      type: "SYSTEM",
      title: "Payment Failed",
      body: "Your subscription payment failed. Please update your payment method to continue your plan.",
      data: { invoiceId: invoice.id },
    },
  });
}
