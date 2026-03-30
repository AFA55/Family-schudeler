import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";
import {
  createStripeCustomer,
  createCheckoutSession,
  type PlanType,
  type BillingInterval,
} from "@/lib/services/stripe";

// POST /api/stripe/checkout - Create a checkout session
export async function POST(request: NextRequest) {
  try {
    const { userId, plan, interval } = await request.json();

    if (!userId || !plan || !interval) {
      return NextResponse.json(
        { error: "userId, plan, and interval are required" },
        { status: 400 }
      );
    }

    if (!["PLUS", "PREMIUM"].includes(plan)) {
      return NextResponse.json(
        { error: "plan must be PLUS or PREMIUM" },
        { status: 400 }
      );
    }

    if (!["monthly", "annual"].includes(interval)) {
      return NextResponse.json(
        { error: "interval must be monthly or annual" },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptions: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get or create Stripe customer
    let stripeCustomerId = user.subscriptions[0]?.stripeCustomerId;
    if (!stripeCustomerId) {
      stripeCustomerId = await createStripeCustomer({
        email: user.email,
        name: user.name,
        userId: user.id,
      });
    }

    // Create checkout session (web checkout = no Apple fee!)
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const checkoutUrl = await createCheckoutSession({
      customerId: stripeCustomerId,
      plan: plan as PlanType,
      interval: interval as BillingInterval,
      successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/pricing`,
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout session creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
