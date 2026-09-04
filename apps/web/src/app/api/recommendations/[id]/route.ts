/**
 * Single Recommendation API
 *
 * GET  /api/recommendations/:id — Get single recommendation with full details
 * POST /api/recommendations/:id — Track a "view" or "click" action
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/recommendations/:id — Get single recommendation
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const recommendation = await prisma.activityRecommendation.findUnique({
      where: { id },
    });

    if (!recommendation) {
      return NextResponse.json(
        { error: "Recommendation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      recommendation: {
        id: recommendation.id,
        title: recommendation.title,
        description: recommendation.description,
        category: recommendation.category,
        imageUrl: recommendation.imageUrl,
        cost: recommendation.cost,
        duration: recommendation.duration,
        ageRange: recommendation.ageRange,
        isIndoor: recommendation.isIndoor,
        isOutdoor: recommendation.isOutdoor,
        tags: recommendation.tags,
        rating: recommendation.rating,
        reviewCount: recommendation.reviewCount,
        isAffiliate: recommendation.isAffiliate,
        affiliateUrl: recommendation.isAffiliate ? recommendation.affiliateUrl : null,
        sourceUrl: recommendation.sourceUrl,
        createdAt: recommendation.createdAt,
      },
    });
  } catch (error) {
    console.error("Failed to fetch recommendation:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendation" },
      { status: 500 }
    );
  }
}

// POST /api/recommendations/:id — Track a "view" or "click" action
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { action } = body;

    if (!action || !["view", "click"].includes(action)) {
      return NextResponse.json(
        { error: "action is required and must be 'view' or 'click'" },
        { status: 400 }
      );
    }

    // Validate the recommendation exists
    const recommendation = await prisma.activityRecommendation.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        isAffiliate: true,
        affiliateUrl: true,
        sourceUrl: true,
      },
    });

    if (!recommendation) {
      return NextResponse.json(
        { error: "Recommendation not found" },
        { status: 404 }
      );
    }

    // Log the tracking event — a dedicated analytics table can be added later
    console.log("[Recommendation Tracking]", {
      recommendationId: id,
      title: recommendation.title,
      action,
      isAffiliate: recommendation.isAffiliate,
      timestamp: new Date().toISOString(),
    });

    const response: Record<string, unknown> = {
      success: true,
      action,
      recommendationId: id,
    };

    // On click, return the appropriate redirect URL
    if (action === "click") {
      response.redirectUrl = recommendation.isAffiliate
        ? recommendation.affiliateUrl
        : recommendation.sourceUrl;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to track recommendation action:", error);
    return NextResponse.json(
      { error: "Failed to track recommendation action" },
      { status: 500 }
    );
  }
}
