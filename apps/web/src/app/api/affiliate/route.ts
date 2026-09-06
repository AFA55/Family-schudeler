/**
 * Affiliate Link Tracking API
 *
 * GET  /api/affiliate/links?activityId=X — Returns affiliate links for an activity
 * POST /api/affiliate/click — Track an affiliate link click
 *
 * Supports:
 * - Amazon Associates (tag=familysync-20)
 * - Viator partner links
 * - GetYourGuide partner links
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";

// Affiliate partner configuration
const AFFILIATE_CONFIG = {
  amazon: {
    tag: "familysync-20",
    baseUrl: "https://www.amazon.com",
  },
  viator: {
    partnerId: process.env.VIATOR_PARTNER_ID || "",
    baseUrl: "https://www.viator.com",
  },
  getyourguide: {
    partnerId: process.env.GETYOURGUIDE_PARTNER_ID || "",
    baseUrl: "https://www.getyourguide.com",
  },
} as const;

/**
 * Append Amazon Associates tag to an Amazon URL
 */
function appendAmazonTag(url: string): string {
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname.includes("amazon.com") ||
      parsed.hostname.includes("amzn.to")
    ) {
      parsed.searchParams.set("tag", AFFILIATE_CONFIG.amazon.tag);
      return parsed.toString();
    }
    return url;
  } catch {
    return url;
  }
}

/**
 * Format a Viator partner link
 */
function formatViatorLink(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("viator.com") && AFFILIATE_CONFIG.viator.partnerId) {
      parsed.searchParams.set("pid", AFFILIATE_CONFIG.viator.partnerId);
      parsed.searchParams.set("mcid", "42383");
      parsed.searchParams.set("medium", "api");
      return parsed.toString();
    }
    return url;
  } catch {
    return url;
  }
}

/**
 * Format a GetYourGuide partner link
 */
function formatGetYourGuideLink(url: string): string {
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname.includes("getyourguide.com") &&
      AFFILIATE_CONFIG.getyourguide.partnerId
    ) {
      parsed.searchParams.set(
        "partner_id",
        AFFILIATE_CONFIG.getyourguide.partnerId
      );
      parsed.searchParams.set("utm_medium", "online_publisher");
      parsed.searchParams.set("utm_source", "familysync");
      return parsed.toString();
    }
    return url;
  } catch {
    return url;
  }
}

/**
 * Transform a raw URL into a tagged affiliate link
 */
function buildAffiliateUrl(url: string): string {
  if (!url) return url;

  // Detect partner and apply tag
  if (url.includes("amazon.com") || url.includes("amzn.to")) {
    return appendAmazonTag(url);
  }
  if (url.includes("viator.com")) {
    return formatViatorLink(url);
  }
  if (url.includes("getyourguide.com")) {
    return formatGetYourGuideLink(url);
  }

  // Return original URL if no affiliate match
  return url;
}

/**
 * Detect which affiliate network a URL belongs to
 */
function detectAffiliateNetwork(
  url: string
): "amazon" | "viator" | "getyourguide" | null {
  if (!url) return null;
  if (url.includes("amazon.com") || url.includes("amzn.to")) return "amazon";
  if (url.includes("viator.com")) return "viator";
  if (url.includes("getyourguide.com")) return "getyourguide";
  return null;
}

// GET /api/affiliate/links?activityId=X — Returns affiliate links for an activity
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const activityId = searchParams.get("activityId");

  if (!activityId) {
    return NextResponse.json(
      { error: "activityId is required" },
      { status: 400 }
    );
  }

  try {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      select: {
        id: true,
        title: true,
        isAffiliate: true,
        affiliateUrl: true,
        sourceUrl: true,
        category: true,
        city: true,
        state: true,
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    // Build affiliate links from available URLs
    const links: Array<{
      url: string;
      network: string | null;
      type: "affiliate" | "source";
    }> = [];

    if (activity.affiliateUrl) {
      links.push({
        url: buildAffiliateUrl(activity.affiliateUrl),
        network: detectAffiliateNetwork(activity.affiliateUrl),
        type: "affiliate",
      });
    }

    if (activity.sourceUrl && activity.sourceUrl !== activity.affiliateUrl) {
      const taggedSource = buildAffiliateUrl(activity.sourceUrl);
      const network = detectAffiliateNetwork(activity.sourceUrl);
      links.push({
        url: taggedSource,
        network,
        type: network ? "affiliate" : "source",
      });
    }

    return NextResponse.json({
      activityId: activity.id,
      title: activity.title,
      isAffiliate: activity.isAffiliate,
      links,
    });
  } catch (error) {
    console.error("Failed to fetch affiliate links:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate links" },
      { status: 500 }
    );
  }
}

// POST /api/affiliate/click — Track an affiliate link click
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { activityId, affiliateUrl, source } = body;

    if (!activityId || !affiliateUrl) {
      return NextResponse.json(
        { error: "activityId and affiliateUrl are required" },
        { status: 400 }
      );
    }

    // Validate the activity exists
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      select: { id: true, title: true },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    const network = detectAffiliateNetwork(affiliateUrl);
    const taggedUrl = buildAffiliateUrl(affiliateUrl);

    // Log click for now — a dedicated clicks table will be added later
    console.log("[Affiliate Click]", {
      activityId,
      activityTitle: activity.title,
      affiliateUrl: taggedUrl,
      network,
      source: source || "unknown",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      redirectUrl: taggedUrl,
      network,
      activityId,
    });
  } catch (error) {
    console.error("Failed to track affiliate click:", error);
    return NextResponse.json(
      { error: "Failed to track affiliate click" },
      { status: 500 }
    );
  }
}
