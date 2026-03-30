/**
 * Stripe Integration Service
 *
 * Handles subscriptions, checkout sessions, and charity contribution tracking.
 * Pricing: Free ($0), Plus ($4.99/mo), Premium ($7.99/mo)
 * 87% of profit goes to charity.
 */

import Stripe from "stripe";

// Initialize Stripe (only on server side)
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(key, { apiVersion: "2024-12-18.acacia" });
}

// Price IDs — set these in Stripe Dashboard and add to .env
const PRICE_IDS = {
  PLUS_MONTHLY: process.env.STRIPE_PLUS_MONTHLY_PRICE_ID || "",
  PLUS_ANNUAL: process.env.STRIPE_PLUS_ANNUAL_PRICE_ID || "",
  PREMIUM_MONTHLY: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || "",
  PREMIUM_ANNUAL: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID || "",
} as const;

export type PlanType = "PLUS" | "PREMIUM";
export type BillingInterval = "monthly" | "annual";

/**
 * Create a Stripe customer for a new user
 */
export async function createStripeCustomer(params: {
  email: string;
  name: string;
  userId: string;
}): Promise<string> {
  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: { userId: params.userId },
  });
  return customer.id;
}

/**
 * Create a checkout session for subscription upgrade
 * Uses web checkout to avoid Apple's 30% fee
 */
export async function createCheckoutSession(params: {
  customerId: string;
  plan: PlanType;
  interval: BillingInterval;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const stripe = getStripe();

  const priceKey = `${params.plan}_${params.interval.toUpperCase()}` as keyof typeof PRICE_IDS;
  const priceId = PRICE_IDS[priceKey];

  if (!priceId) {
    throw new Error(`Price ID not configured for ${params.plan} ${params.interval}`);
  }

  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 14,
      metadata: { plan: params.plan },
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    allow_promotion_codes: true,
  });

  return session.url || "";
}

/**
 * Create a customer portal session for managing subscription
 */
export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<string> {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });
  return session.url;
}

/**
 * Cancel a subscription at period end
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<void> {
  const stripe = getStripe();
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Resume a canceled subscription (undo cancel at period end)
 */
export async function resumeSubscription(
  subscriptionId: string
): Promise<void> {
  const stripe = getStripe();
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

/**
 * Calculate charity contribution from a payment
 * 87% of PROFIT (not revenue)
 *
 * Profit calculation:
 * Revenue - Stripe fees (2.9% + $0.30) - App Store fee (0% via web checkout) - Operating margin (~30%)
 * Then 87% of remaining profit goes to charity
 */
export function calculateCharityContribution(amountCents: number): {
  revenue: number;
  stripeFee: number;
  operatingCost: number;
  profit: number;
  charityAmount: number;
  retainedAmount: number;
} {
  const revenue = amountCents / 100;
  const stripeFee = revenue * 0.029 + 0.3; // Stripe's standard fee
  const afterFees = revenue - stripeFee;
  const operatingCost = afterFees * 0.3; // ~30% operating costs
  const profit = afterFees - operatingCost;
  const charityAmount = profit * 0.87;
  const retainedAmount = profit * 0.13;

  return {
    revenue: Math.round(revenue * 100) / 100,
    stripeFee: Math.round(stripeFee * 100) / 100,
    operatingCost: Math.round(operatingCost * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    charityAmount: Math.round(charityAmount * 100) / 100,
    retainedAmount: Math.round(retainedAmount * 100) / 100,
  };
}

/**
 * Map Stripe subscription status to our SubscriptionStatus enum
 */
export function mapStripeStatus(
  status: Stripe.Subscription.Status
): "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "INCOMPLETE" {
  switch (status) {
    case "trialing":
      return "TRIALING";
    case "active":
      return "ACTIVE";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
    case "unpaid":
      return "CANCELED";
    default:
      return "INCOMPLETE";
  }
}

/**
 * Map Stripe price to our plan type
 */
export function mapStripePlan(priceId: string): "FREE" | "FAMILY" | "FAMILY_PLUS" {
  if (
    priceId === PRICE_IDS.PLUS_MONTHLY ||
    priceId === PRICE_IDS.PLUS_ANNUAL
  ) {
    return "FAMILY";
  }
  if (
    priceId === PRICE_IDS.PREMIUM_MONTHLY ||
    priceId === PRICE_IDS.PREMIUM_ANNUAL
  ) {
    return "FAMILY_PLUS";
  }
  return "FREE";
}
