/**
 * Discovery Feed API Route
 *
 * Aggregates activities from multiple sources:
 * - Database activities (by city/state/category)
 * - Social content (TikTok, YouTube) matched to activities
 * - Trending section with most-viewed social content
 *
 * Query params: city, state, category, platform, page, limit, lat, lng
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma, ActivityType, SocialPlatform } from "@familysync/database";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const TRENDING_LIMIT = 10;

// GET /api/discover - Get discovery feed for a location
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const state = searchParams.get("state");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const category = searchParams.get("category");
  const platform = searchParams.get("platform");
  const page = Math.max(1, parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10));
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10))
  );

  if (!city && (!lat || !lng)) {
    return NextResponse.json(
      { error: "Provide city/state or lat/lng" },
      { status: 400 }
    );
  }

  try {
    const skip = (page - 1) * limit;

    // --- Build activity query filters ---
    const activityWhere: Record<string, unknown> = {};

    if (city) {
      activityWhere.city = { equals: city, mode: "insensitive" };
    }
    if (state) {
      activityWhere.state = { equals: state, mode: "insensitive" };
    }
    if (category) {
      // Validate that the category is a valid ActivityType
      const upperCategory = category.toUpperCase();
      if (Object.values(ActivityType).includes(upperCategory as ActivityType)) {
        activityWhere.category = upperCategory as ActivityType;
      }
    }

    // --- Fetch activities from database ---
    const [activities, totalActivities] = await Promise.all([
      prisma.activity.findMany({
        where: activityWhere,
        include: {
          socialContent: {
            take: 3,
            orderBy: { viewCount: "desc" },
          },
        },
        orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
        skip,
        take: limit,
      }),
      prisma.activity.count({ where: activityWhere }),
    ]);

    // --- Build social content query filters ---
    const socialWhere: Record<string, unknown> = {};

    if (city) {
      socialWhere.city = { equals: city, mode: "insensitive" };
    }
    if (state) {
      socialWhere.state = { equals: state, mode: "insensitive" };
    }
    if (platform) {
      const upperPlatform = platform.toUpperCase();
      if (
        Object.values(SocialPlatform).includes(upperPlatform as SocialPlatform)
      ) {
        socialWhere.platform = upperPlatform as SocialPlatform;
      }
    }

    // --- Fetch trending social content ---
    const trending = await prisma.socialContent.findMany({
      where: {
        ...socialWhere,
        viewCount: { not: null },
      },
      orderBy: { viewCount: "desc" },
      take: TRENDING_LIMIT,
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
      },
    });

    // --- Group activities by category ---
    const grouped: Record<string, typeof activities> = {};
    for (const activity of activities) {
      const cat = activity.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(activity);
    }

    return NextResponse.json({
      trending: trending.map((sc) => ({
        id: sc.id,
        type: "social",
        platform: sc.platform,
        title: sc.title,
        authorName: sc.authorName,
        authorHandle: sc.authorHandle,
        viewCount: sc.viewCount,
        likeCount: sc.likeCount,
        thumbnail: sc.thumbnail,
        url: sc.url,
        embedHtml: sc.embedHtml,
        city: sc.city,
        state: sc.state,
        activity: sc.activity,
      })),
      activities: activities.map((a) => ({
        id: a.id,
        type: "place",
        title: a.title,
        description: a.description,
        category: a.category,
        cost: a.cost,
        rating: a.rating,
        reviewCount: a.reviewCount,
        city: a.city,
        state: a.state,
        imageUrl: a.imageUrl,
        isAffiliate: a.isAffiliate,
        affiliateUrl: a.affiliateUrl,
        tags: a.tags,
        socialContent: a.socialContent.map((sc) => ({
          id: sc.id,
          platform: sc.platform,
          title: sc.title,
          thumbnail: sc.thumbnail,
          viewCount: sc.viewCount,
          url: sc.url,
        })),
      })),
      groupedByCategory: Object.entries(grouped).map(([cat, items]) => ({
        category: cat,
        count: items.length,
        activities: items.map((a) => ({
          id: a.id,
          title: a.title,
          cost: a.cost,
          rating: a.rating,
          imageUrl: a.imageUrl,
          isAffiliate: a.isAffiliate,
        })),
      })),
      pagination: {
        page,
        limit,
        total: totalActivities,
        totalPages: Math.ceil(totalActivities / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch discovery feed:", error);
    return NextResponse.json(
      { error: "Failed to fetch discovery feed" },
      { status: 500 }
    );
  }
}
