/**
 * Trending Social Content API
 *
 * GET /api/discover/trending?city=X&limit=10
 *
 * Returns the most-viewed social content (TikTok, YouTube, Instagram)
 * for a given city, optionally filtered by platform.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma, SocialPlatform } from "@familysync/database";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// GET /api/discover/trending?city=X&state=Y&platform=TIKTOK&limit=10
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const state = searchParams.get("state");
  const platform = searchParams.get("platform");
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10))
  );

  if (!city) {
    return NextResponse.json(
      { error: "city is required" },
      { status: 400 }
    );
  }

  try {
    const where: Record<string, unknown> = {
      city: { equals: city, mode: "insensitive" },
      viewCount: { not: null },
    };

    if (state) {
      where.state = { equals: state, mode: "insensitive" };
    }

    if (platform) {
      const upperPlatform = platform.toUpperCase();
      if (
        Object.values(SocialPlatform).includes(upperPlatform as SocialPlatform)
      ) {
        where.platform = upperPlatform as SocialPlatform;
      }
    }

    const trending = await prisma.socialContent.findMany({
      where,
      orderBy: { viewCount: "desc" },
      take: limit,
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            category: true,
            cost: true,
            rating: true,
            isAffiliate: true,
            affiliateUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      city,
      state: state || null,
      platform: platform?.toUpperCase() || "ALL",
      count: trending.length,
      trending: trending.map((sc) => ({
        id: sc.id,
        platform: sc.platform,
        externalId: sc.externalId,
        url: sc.url,
        embedHtml: sc.embedHtml,
        title: sc.title,
        description: sc.description,
        thumbnail: sc.thumbnail,
        authorName: sc.authorName,
        authorHandle: sc.authorHandle,
        authorUrl: sc.authorUrl,
        viewCount: sc.viewCount,
        likeCount: sc.likeCount,
        isVerified: sc.isVerified,
        createdAt: sc.createdAt,
        activity: sc.activity
          ? {
              id: sc.activity.id,
              title: sc.activity.title,
              category: sc.activity.category,
              cost: sc.activity.cost,
              rating: sc.activity.rating,
              isAffiliate: sc.activity.isAffiliate,
              affiliateUrl: sc.activity.affiliateUrl,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch trending content:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending content" },
      { status: 500 }
    );
  }
}
