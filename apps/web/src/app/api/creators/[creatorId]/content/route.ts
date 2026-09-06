/**
 * Creator Content API
 *
 * GET /api/creators/:creatorId/content — List social content associated with this creator
 *
 * Links SocialContent records where authorHandle matches the creator's handle
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";
import type { SocialPlatform } from "@prisma/client";

const SocialPlatformValues = ["TIKTOK", "YOUTUBE", "INSTAGRAM"] as const;

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

type RouteParams = { params: Promise<{ creatorId: string }> };

// GET /api/creators/:creatorId/content — List creator's social content
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { creatorId } = await params;
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");
  const page = Math.max(1, parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10));
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10))
  );

  try {
    // Fetch the creator to get their handle and platform
    const creator = await prisma.creatorPartner.findUnique({
      where: { id: creatorId },
    });

    if (!creator) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    const skip = (page - 1) * limit;

    // Build content query — match by authorHandle
    const contentWhere: Record<string, unknown> = {
      authorHandle: creator.handle,
    };

    // If a platform filter is provided, use it; otherwise default to the creator's platform
    if (platform) {
      const upperPlatform = platform.toUpperCase();
      if ((SocialPlatformValues as readonly string[]).includes(upperPlatform)) {
        contentWhere.platform = upperPlatform as SocialPlatform;
      }
    } else {
      contentWhere.platform = creator.platform;
    }

    const [content, total] = await Promise.all([
      prisma.socialContent.findMany({
        where: contentWhere,
        include: {
          activity: {
            select: {
              id: true,
              title: true,
              category: true,
              city: true,
              state: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.socialContent.count({ where: contentWhere }),
    ]);

    return NextResponse.json({
      creator: {
        id: creator.id,
        name: creator.name,
        handle: creator.handle,
        platform: creator.platform,
      },
      content: content.map((sc) => ({
        id: sc.id,
        platform: sc.platform,
        url: sc.url,
        title: sc.title,
        description: sc.description,
        thumbnail: sc.thumbnail,
        viewCount: sc.viewCount,
        likeCount: sc.likeCount,
        isVerified: sc.isVerified,
        city: sc.city,
        state: sc.state,
        activity: sc.activity,
        createdAt: sc.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch creator content:", error);
    return NextResponse.json(
      { error: "Failed to fetch creator content" },
      { status: 500 }
    );
  }
}
