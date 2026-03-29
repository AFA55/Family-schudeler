/**
 * Discovery Feed API Route
 *
 * Aggregates activities from multiple sources:
 * - Google Places (nearby restaurants, attractions)
 * - Recreation.gov RIDB (parks, trails, campgrounds) [FREE]
 * - YouTube (trending video content) [FREE]
 * - User-submitted social content (TikTok, Instagram links)
 *
 * Total API cost: ~$275/month for 5 launch cities
 */

import { NextRequest, NextResponse } from "next/server";

// GET /api/discover - Get discovery feed for a location
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const state = searchParams.get("state");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const category = searchParams.get("category");

  if (!city && (!lat || !lng)) {
    return NextResponse.json(
      { error: "Provide city/state or lat/lng" },
      { status: 400 }
    );
  }

  // TODO: Implement aggregation from multiple sources
  // 1. Check cache first (48hr TTL for YouTube, 7d for Places, 24h for social)
  // 2. If cache miss, fetch from APIs in parallel:
  //    - Google Places: nearby search by category
  //    - RIDB: recreation areas within radius (FREE)
  //    - YouTube: cached video search results
  //    - Database: user-submitted social content for this city
  // 3. Normalize and score results using ranking algorithm
  // 4. Return ranked feed

  const mockFeed = {
    trending: [
      {
        id: "t1",
        type: "social",
        platform: "YOUTUBE",
        title: "Top 10 Hidden Gems in Salt Lake City",
        authorName: "Adventure Family SLC",
        viewCount: 89000,
        thumbnail: null,
        city: city || "Salt Lake City",
      },
      {
        id: "t2",
        type: "social",
        platform: "TIKTOK",
        title: "This trail is INSANE and only 20 min away",
        authorName: "@hikingmom_slc",
        viewCount: 2300000,
        thumbnail: null,
        city: city || "Salt Lake City",
      },
    ],
    activities: [
      {
        id: "a1",
        type: "place",
        title: "Red Butte Garden",
        category: "PARK",
        cost: "BUDGET",
        rating: 4.7,
        reviewCount: 1200,
        distance: "3.2 mi",
        source: "google_places",
      },
      {
        id: "a2",
        type: "recreation",
        title: "Big Cottonwood Canyon Trail",
        category: "TRAIL",
        cost: "FREE",
        rating: 4.9,
        distance: "12 mi",
        source: "ridb",
        tags: ["hiking", "scenic views", "family-friendly"],
      },
      {
        id: "a3",
        type: "event",
        title: "Family Art Walk - Downtown",
        category: "EVENT",
        cost: "FREE",
        date: "2026-04-04",
        source: "eventbrite",
      },
    ],
    message: "Discovery feed ready — connect API keys to activate live data",
  };

  return NextResponse.json(mockFeed);
}

// POST /api/discover/submit - Submit a social media link
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { url, city, state } = body;

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // TODO: Validate URL is from supported platform (TikTok, YouTube, Instagram)
  // TODO: Call oEmbed API (TikTok) or YouTube Data API to get metadata
  // TODO: Use AI to classify: city, activity type, age range
  // TODO: Store in social_content table
  // TODO: Link to existing activity or create new one

  return NextResponse.json({
    success: true,
    message: "Social content submitted — connect APIs to process",
    content: { url, city, state },
  });
}
