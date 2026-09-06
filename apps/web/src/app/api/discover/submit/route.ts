/**
 * Social Content Submission API
 *
 * POST /api/discover/submit — Submit a social media link
 *
 * Users paste a TikTok or YouTube link. We fetch metadata via oEmbed / YouTube API
 * and create a SocialContent record in the database.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";
import {
  isTikTokUrl,
  getTikTokEmbed,
  parseTikTokEmbed,
} from "@/lib/services/tiktok";

/**
 * Detect platform from a URL
 */
function detectPlatform(
  url: string
): "TIKTOK" | "YOUTUBE" | "INSTAGRAM" | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("tiktok.com") || host.includes("vm.tiktok.com")) {
      return "TIKTOK";
    }
    if (
      host.includes("youtube.com") ||
      host.includes("youtu.be") ||
      host.includes("m.youtube.com")
    ) {
      return "YOUTUBE";
    }
    if (host.includes("instagram.com")) {
      return "INSTAGRAM";
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);

    // youtube.com/watch?v=ID
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }

    // youtu.be/ID
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1) || null;
    }

    return null;
  } catch {
    return null;
  }
}

// POST /api/discover/submit — Submit a social media link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, city, state, submittedBy } = body;

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }
    if (!city || !state) {
      return NextResponse.json(
        { error: "city and state are required" },
        { status: 400 }
      );
    }

    const platform = detectPlatform(url);
    if (!platform) {
      return NextResponse.json(
        {
          error: "Unsupported platform. Supported: TikTok, YouTube, Instagram",
        },
        { status: 400 }
      );
    }

    // --- Process by platform ---

    if (platform === "TIKTOK") {
      if (!isTikTokUrl(url)) {
        return NextResponse.json(
          { error: "Invalid TikTok URL format" },
          { status: 400 }
        );
      }

      // Fetch oEmbed data from TikTok (free, no auth required)
      const embedData = await getTikTokEmbed(url);
      if (!embedData) {
        return NextResponse.json(
          { error: "Failed to fetch TikTok embed data. Check the URL." },
          { status: 422 }
        );
      }

      const parsed = parseTikTokEmbed(url, embedData);

      // Check for duplicates
      const existing = await prisma.socialContent.findUnique({
        where: {
          platform_externalId: {
            platform: "TIKTOK",
            externalId: parsed.externalId,
          },
        },
      });

      if (existing) {
        return NextResponse.json({
          success: true,
          message: "This TikTok has already been submitted",
          content: existing,
          duplicate: true,
        });
      }

      // Create SocialContent record
      const content = await prisma.socialContent.create({
        data: {
          platform: "TIKTOK",
          externalId: parsed.externalId,
          url: parsed.url,
          embedHtml: parsed.embedHtml,
          title: parsed.title,
          thumbnail: parsed.thumbnail,
          authorName: parsed.authorName,
          authorHandle: parsed.authorHandle,
          authorUrl: parsed.authorUrl,
          city,
          state,
          submittedBy: submittedBy || null,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "TikTok content submitted successfully",
          content,
        },
        { status: 201 }
      );
    }

    if (platform === "YOUTUBE") {
      const videoId = extractYouTubeVideoId(url);
      if (!videoId) {
        return NextResponse.json(
          { error: "Could not extract YouTube video ID from URL" },
          { status: 400 }
        );
      }

      // Check for duplicates
      const existing = await prisma.socialContent.findUnique({
        where: {
          platform_externalId: {
            platform: "YOUTUBE",
            externalId: videoId,
          },
        },
      });

      if (existing) {
        return NextResponse.json({
          success: true,
          message: "This YouTube video has already been submitted",
          content: existing,
          duplicate: true,
        });
      }

      // For YouTube, we create a basic record. The YouTube service can
      // enrich it later with view counts and channel info via a background job.
      const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;

      const content = await prisma.socialContent.create({
        data: {
          platform: "YOUTUBE",
          externalId: videoId,
          url: canonicalUrl,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          city,
          state,
          submittedBy: submittedBy || null,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message:
            "YouTube video submitted successfully. Metadata will be enriched shortly.",
          content,
        },
        { status: 201 }
      );
    }

    if (platform === "INSTAGRAM") {
      // Instagram oEmbed requires a token; store the URL for manual review
      const content = await prisma.socialContent.create({
        data: {
          platform: "INSTAGRAM",
          externalId: url, // Use URL as external ID until we can extract the real one
          url,
          city,
          state,
          submittedBy: submittedBy || null,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message:
            "Instagram link submitted. Metadata enrichment requires Instagram API setup.",
          content,
        },
        { status: 201 }
      );
    }

    // Should not reach here given the platform check above
    return NextResponse.json(
      { error: "Unsupported platform" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to submit social content:", error);
    return NextResponse.json(
      { error: "Failed to submit social content" },
      { status: 500 }
    );
  }
}
