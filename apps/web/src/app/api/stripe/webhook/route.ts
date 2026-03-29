import { NextRequest, NextResponse } from "next/server";

// POST /api/stripe/webhook - Handle Stripe webhook events
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 });
  }

  // TODO: Verify webhook signature
  // TODO: Handle events:
  //   - checkout.session.completed → create subscription
  //   - customer.subscription.updated → update subscription
  //   - customer.subscription.deleted → cancel subscription
  //   - invoice.payment_succeeded → log payment, calculate charity contribution
  //   - invoice.payment_failed → notify user

  return NextResponse.json({ received: true });
}
