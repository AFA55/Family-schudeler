/**
 * Creator Self-Registration (Onboard) API
 *
 * POST /api/creators/onboard — Creator self-registration endpoint
 *
 * Input: { name, handle, platform, city, state, profileUrl }
 * Creates a CreatorPartner with tier=AFFILIATE and default commission rate (15%)
 * Returns the new creator profile with a referral code
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma, SocialPlatform } from "@familysync/database";
import crypto from "crypto";

// POST /api/creators/onboard — Creator self-registration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, handle, platform, city, state, profileUrl } = body;

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

    // Normalize handle — ensure it starts with @
    const normalizedHandle = handle.startsWith("@") ? handle : `@${handle}`;

    // Check if this creator already exists
    const existing = await prisma.creatorPartner.findUnique({
      where: {
        platform_handle: {
          platform: upperPlatform as SocialPlatform,
          handle: normalizedHandle,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A creator with this platform and handle is already registered" },
        { status: 409 }
      );
    }

    // Generate a unique referral code
    const referralCode = `FS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const creator = await prisma.creatorPartner.create({
      data: {
        name,
        handle: normalizedHandle,
        platform: upperPlatform as SocialPlatform,
        city,
        state,
        profileUrl: profileUrl || null,
        tier: "AFFILIATE",
        commissionRate: 0.15, // 15% default
      },
    });

    return NextResponse.json(
      {
        creator: {
          id: creator.id,
          name: creator.name,
          handle: creator.handle,
          platform: creator.platform,
          profileUrl: creator.profileUrl,
          city: creator.city,
          state: creator.state,
          tier: creator.tier,
          commissionRate: creator.commissionRate,
          joinedAt: creator.joinedAt,
        },
        referralCode,
        message: "Welcome to FamilySync! Share your referral code to start earning.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to onboard creator:", error);
    return NextResponse.json(
      { error: "Failed to onboard creator" },
      { status: 500 }
    );
  }
}
