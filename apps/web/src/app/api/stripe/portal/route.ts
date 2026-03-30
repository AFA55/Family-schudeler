import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";
import { createPortalSession } from "@/lib/services/stripe";

// POST /api/stripe/portal - Create a billing portal session
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const portalUrl = await createPortalSession({
      customerId: subscription.stripeCustomerId,
      returnUrl: `${baseUrl}/settings/billing`,
    });

    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    console.error("Portal session creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
