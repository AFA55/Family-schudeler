import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";
import { cancelSubscription, resumeSubscription } from "@/lib/services/stripe";

// GET /api/stripe/subscription?userId=X - Get user's subscription status
export async function GET(request: NextRequest) {
  const userId = new URL(request.url).searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 }
    );
  }

  try {
    const subscription = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!subscription) {
      return NextResponse.json({
        subscription: {
          plan: "FREE",
          status: "ACTIVE",
          trialEndsAt: null,
          currentPeriodEnd: null,
        },
      });
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Failed to fetch subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

// PUT /api/stripe/subscription - Cancel or resume subscription
export async function PUT(request: NextRequest) {
  try {
    const { userId, action } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: "userId and action are required" },
        { status: 400 }
      );
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!subscription?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    if (action === "cancel") {
      await cancelSubscription(subscription.stripeSubscriptionId);
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { cancelAtPeriodEnd: true },
      });
    } else if (action === "resume") {
      await resumeSubscription(subscription.stripeSubscriptionId);
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { cancelAtPeriodEnd: false },
      });
    } else {
      return NextResponse.json(
        { error: "action must be 'cancel' or 'resume'" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, action });
  } catch (error) {
    console.error("Subscription update failed:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
