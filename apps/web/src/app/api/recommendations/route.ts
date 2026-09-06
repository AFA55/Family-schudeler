/**
 * Activity Recommendations API
 *
 * GET /api/recommendations — Returns activity recommendations with affiliate links
 *
 * Query params: category, isIndoor, isOutdoor, ageRange, budget, page, limit
 * Enriches results with affiliate URLs where isAffiliate=true
 * Supports pagination
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

// GET /api/recommendations — Paginated activity recommendations
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const isIndoor = searchParams.get("isIndoor");
  const isOutdoor = searchParams.get("isOutdoor");
  const ageRange = searchParams.get("ageRange");
  const budget = searchParams.get("budget");
  const page = Math.max(1, parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10));
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10))
  );

  try {
    const skip = (page - 1) * limit;

    // Build query filters
    const where: Record<string, unknown> = {};

    if (category) {
      where.category = { equals: category, mode: "insensitive" };
    }

    if (isIndoor !== null && isIndoor !== undefined && isIndoor !== "") {
      where.isIndoor = isIndoor === "true";
    }

    if (isOutdoor !== null && isOutdoor !== undefined && isOutdoor !== "") {
      where.isOutdoor = isOutdoor === "true";
    }

    if (ageRange) {
      where.ageRange = { equals: ageRange, mode: "insensitive" };
    }

    if (budget) {
      where.cost = { equals: budget, mode: "insensitive" };
    }

    const [recommendations, total] = await Promise.all([
      prisma.activityRecommendation.findMany({
        where,
        orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.activityRecommendation.count({ where }),
    ]);

    return NextResponse.json({
      recommendations: recommendations.map((rec) => ({
        id: rec.id,
        title: rec.title,
        description: rec.description,
        category: rec.category,
        imageUrl: rec.imageUrl,
        cost: rec.cost,
        duration: rec.duration,
        ageRange: rec.ageRange,
        isIndoor: rec.isIndoor,
        isOutdoor: rec.isOutdoor,
        tags: rec.tags,
        rating: rec.rating,
        reviewCount: rec.reviewCount,
        isAffiliate: rec.isAffiliate,
        // Enrich with affiliate URL only when it exists
        affiliateUrl: rec.isAffiliate ? rec.affiliateUrl : null,
        sourceUrl: rec.sourceUrl,
        createdAt: rec.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
