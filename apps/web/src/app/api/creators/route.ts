/**
 * Creator Partners API
 *
 * GET  /api/creators — List active creator partners, filterable by city, state, platform, tier
 * POST /api/creators — Admin endpoint to create a new creator partner
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma, SocialPlatform, CreatorTier } from "@familysync/database";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

// GET /api/creators — List active creator partners
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const state = searchParams.get("state");
  const platform = searchParams.get("platform");
  const tier = searchParams.get("tier");
  const page = Math.max(1, parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10));
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10))
  );

  try {
    const skip = (page - 1) * limit;

    // Build query filters
    const where: Record<string, unknown> = { isActive: true };

    if (city) {
      where.city = { equals: city, mode: "insensitive" };
    }
    if (state) {
      where.state = { equals: state, mode: "insensitive" };
    }
    if (platform) {
      const upperPlatform = platform.toUpperCase();
      if (Object.values(SocialPlatform).includes(upperPlatform as SocialPlatform)) {
        where.platform = upperPlatform as SocialPlatform;
      }
    }
    if (tier) {
      const upperTier = tier.toUpperCase();
      if (Object.values(CreatorTier).includes(upperTier as CreatorTier)) {
        where.tier = upperTier as CreatorTier;
      }
    }

    const [creators, total] = await Promise.all([
      prisma.creatorPartner.findMany({
        where,
        orderBy: [{ tier: "asc" }, { joinedAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.creatorPartner.count({ where }),
    ]);

    return NextResponse.json({
      creators: creators.map((c) => ({
        id: c.id,
        name: c.name,
        handle: c.handle,
        platform: c.platform,
        profileUrl: c.profileUrl,
        followerCount: c.followerCount,
        city: c.city,
        state: c.state,
        tier: c.tier,
        commissionRate: c.commissionRate,
        joinedAt: c.joinedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch creators:", error);
    return NextResponse.json(
      { error: "Failed to fetch creators" },
      { status: 500 }
    );
  }
}

// POST /api/creators — Admin endpoint to create a new creator partner
export async function POST(request: NextRequest) {
  // Admin auth check
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json(
      { error: "Unauthorized — admin access required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name, handle, platform, city, state, profileUrl, followerCount, tier, commissionRate } = body;

    // Validate required fields
    if (!name || !handle || !platform || !city || !state) {
      return NextResponse.json(
        { error: "name, handle, platform, city, and state are required" },
        { status: 400 }
      );
    }

    // Validate platform enum
    const upperPlatform = platform.toUpperCase();
    if (!Object.values(SocialPlatform).includes(upperPlatform as SocialPlatform)) {
      return NextResponse.json(
        { error: `Invalid platform. Must be one of: ${Object.values(SocialPlatform).join(", ")}` },
        { status: 400 }
      );
    }

    // Validate tier enum if provided
    if (tier) {
      const upperTier = tier.toUpperCase();
      if (!Object.values(CreatorTier).includes(upperTier as CreatorTier)) {
        return NextResponse.json(
          { error: `Invalid tier. Must be one of: ${Object.values(CreatorTier).join(", ")}` },
          { status: 400 }
        );
      }
    }

    const creator = await prisma.creatorPartner.create({
      data: {
        name,
        handle: handle.startsWith("@") ? handle : `@${handle}`,
        platform: upperPlatform as SocialPlatform,
        city,
        state,
        profileUrl: profileUrl || null,
        followerCount: followerCount ? parseInt(followerCount, 10) : null,
        tier: tier ? (tier.toUpperCase() as CreatorTier) : "AFFILIATE",
        commissionRate: commissionRate ? parseFloat(commissionRate) : 0.15,
      },
    });

    return NextResponse.json({ creator }, { status: 201 });
  } catch (error) {
    // Handle unique constraint violation (platform + handle)
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return NextResponse.json(
        { error: "A creator with this platform and handle already exists" },
        { status: 409 }
      );
    }

    console.error("Failed to create creator:", error);
    return NextResponse.json(
      { error: "Failed to create creator" },
      { status: 500 }
    );
  }
}
