/**
 * Creator Partner Detail API
 *
 * GET    /api/creators/:creatorId — Get creator details
 * PUT    /api/creators/:creatorId — Update creator profile (admin)
 * DELETE /api/creators/:creatorId — Deactivate creator (soft delete via isActive=false)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma, SocialPlatform, CreatorTier } from "@familysync/database";

type RouteParams = { params: Promise<{ creatorId: string }> };

// GET /api/creators/:creatorId — Get creator details
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { creatorId } = await params;

  try {
    const creator = await prisma.creatorPartner.findUnique({
      where: { id: creatorId },
    });

    if (!creator) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    // Also fetch content count for this creator's handle
    const contentCount = await prisma.socialContent.count({
      where: {
        authorHandle: creator.handle,
        platform: creator.platform,
      },
    });

    return NextResponse.json({
      creator: {
        id: creator.id,
        name: creator.name,
        handle: creator.handle,
        platform: creator.platform,
        profileUrl: creator.profileUrl,
        followerCount: creator.followerCount,
        city: creator.city,
        state: creator.state,
        tier: creator.tier,
        commissionRate: creator.commissionRate,
        isActive: creator.isActive,
        joinedAt: creator.joinedAt,
        contentCount,
      },
    });
  } catch (error) {
    console.error("Failed to fetch creator:", error);
    return NextResponse.json(
      { error: "Failed to fetch creator" },
      { status: 500 }
    );
  }
}

// PUT /api/creators/:creatorId — Update creator profile (admin)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { creatorId } = await params;

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

    const existing = await prisma.creatorPartner.findUnique({
      where: { id: creatorId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    // Build update payload — only include provided fields
    const updateData: Record<string, unknown> = {};

    const stringFields = ["name", "profileUrl", "city", "state"];
    for (const field of stringFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (body.handle !== undefined) {
      updateData.handle = body.handle.startsWith("@") ? body.handle : `@${body.handle}`;
    }

    if (body.platform !== undefined) {
      const upperPlatform = body.platform.toUpperCase();
      if (!Object.values(SocialPlatform).includes(upperPlatform as SocialPlatform)) {
        return NextResponse.json(
          { error: `Invalid platform. Must be one of: ${Object.values(SocialPlatform).join(", ")}` },
          { status: 400 }
        );
      }
      updateData.platform = upperPlatform as SocialPlatform;
    }

    if (body.tier !== undefined) {
      const upperTier = body.tier.toUpperCase();
      if (!Object.values(CreatorTier).includes(upperTier as CreatorTier)) {
        return NextResponse.json(
          { error: `Invalid tier. Must be one of: ${Object.values(CreatorTier).join(", ")}` },
          { status: 400 }
        );
      }
      updateData.tier = upperTier as CreatorTier;
    }

    if (body.followerCount !== undefined) {
      updateData.followerCount = parseInt(body.followerCount, 10);
    }

    if (body.commissionRate !== undefined) {
      updateData.commissionRate = parseFloat(body.commissionRate);
    }

    if (body.isActive !== undefined) {
      updateData.isActive = Boolean(body.isActive);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const creator = await prisma.creatorPartner.update({
      where: { id: creatorId },
      data: updateData,
    });

    return NextResponse.json({ creator });
  } catch (error) {
    console.error("Failed to update creator:", error);
    return NextResponse.json(
      { error: "Failed to update creator" },
      { status: 500 }
    );
  }
}

// DELETE /api/creators/:creatorId — Soft-delete creator (set isActive=false)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { creatorId } = await params;

  // Admin auth check
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json(
      { error: "Unauthorized — admin access required" },
      { status: 401 }
    );
  }

  try {
    const existing = await prisma.creatorPartner.findUnique({
      where: { id: creatorId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    const creator = await prisma.creatorPartner.update({
      where: { id: creatorId },
      data: { isActive: false },
    });

    return NextResponse.json({
      message: "Creator deactivated",
      creator: {
        id: creator.id,
        name: creator.name,
        handle: creator.handle,
        isActive: creator.isActive,
      },
    });
  } catch (error) {
    console.error("Failed to deactivate creator:", error);
    return NextResponse.json(
      { error: "Failed to deactivate creator" },
      { status: 500 }
    );
  }
}
