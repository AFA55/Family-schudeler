/**
 * Affiliate Data API — Per Activity
 *
 * GET  /api/affiliate/:activityId — Returns affiliate data for a specific activity
 * PUT  /api/affiliate/:activityId — Update affiliate URL and commission info (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";

// GET /api/affiliate/:activityId — Returns affiliate data for a specific activity
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ activityId: string }> }
) {
  const { activityId } = await params;

  try {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      select: {
        id: true,
        title: true,
        category: true,
        city: true,
        state: true,
        isAffiliate: true,
        affiliateUrl: true,
        sourceUrl: true,
        rating: true,
        reviewCount: true,
        cost: true,
        imageUrl: true,
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    // Detect the affiliate network from the URL
    let network: string | null = null;
    if (activity.affiliateUrl) {
      if (
        activity.affiliateUrl.includes("amazon.com") ||
        activity.affiliateUrl.includes("amzn.to")
      ) {
        network = "amazon";
      } else if (activity.affiliateUrl.includes("viator.com")) {
        network = "viator";
      } else if (activity.affiliateUrl.includes("getyourguide.com")) {
        network = "getyourguide";
      }
    }

    return NextResponse.json({
      activity: {
        id: activity.id,
        title: activity.title,
        category: activity.category,
        city: activity.city,
        state: activity.state,
        cost: activity.cost,
        rating: activity.rating,
        reviewCount: activity.reviewCount,
        imageUrl: activity.imageUrl,
      },
      affiliate: {
        isAffiliate: activity.isAffiliate,
        affiliateUrl: activity.affiliateUrl,
        sourceUrl: activity.sourceUrl,
        network,
      },
    });
  } catch (error) {
    console.error("Failed to fetch affiliate data:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate data" },
      { status: 500 }
    );
  }
}

// PUT /api/affiliate/:activityId — Update affiliate URL and commission info (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ activityId: string }> }
) {
  const { activityId } = await params;

  // TODO: Add proper admin auth check via NextAuth session
  // For now, check for a simple admin header (replace with real auth)
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json(
      { error: "Unauthorized — admin access required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { affiliateUrl, isAffiliate, sourceUrl } = body;

    // Validate the activity exists
    const existing = await prisma.activity.findUnique({
      where: { id: activityId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    // Build update payload — only include provided fields
    const updateData: Record<string, unknown> = {};
    if (affiliateUrl !== undefined) updateData.affiliateUrl = affiliateUrl;
    if (isAffiliate !== undefined) updateData.isAffiliate = Boolean(isAffiliate);
    if (sourceUrl !== undefined) updateData.sourceUrl = sourceUrl;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.activity.update({
      where: { id: activityId },
      data: updateData,
      select: {
        id: true,
        title: true,
        isAffiliate: true,
        affiliateUrl: true,
        sourceUrl: true,
        updatedAt: true,
      },
    });

    console.log("[Affiliate Update]", {
      activityId,
      title: updated.title,
      affiliateUrl: updated.affiliateUrl,
      isAffiliate: updated.isAffiliate,
    });

    return NextResponse.json({ activity: updated });
  } catch (error) {
    console.error("Failed to update affiliate data:", error);
    return NextResponse.json(
      { error: "Failed to update affiliate data" },
      { status: 500 }
    );
  }
}
