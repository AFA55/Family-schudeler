/**
 * YouTube Data API v3 Integration
 *
 * Used for searching "things to do in [city]" content.
 * Free tier: 10,000 units/day. Search costs 100 units per call.
 * Strategy: Search once per city/category, cache results for 48 hours.
 *
 * Docs: https://developers.google.com/youtube/v3
 */

interface YouTubeSearchResult {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
    channelTitle: string;
    channelId: string;
    publishedAt: string;
  };
}

interface YouTubeSearchResponse {
  items: YouTubeSearchResult[];
  pageInfo: { totalResults: number; resultsPerPage: number };
  nextPageToken?: string;
}

interface YouTubeVideoDetails {
  id: string;
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

/**
 * Search YouTube for family activity videos in a specific city
 * Cost: 100 quota units per call
 */
export async function searchYouTubeActivities(params: {
  city: string;
  state: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  maxResults?: number;
}): Promise<YouTubeSearchResult[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("YOUTUBE_API_KEY not configured");
    return [];
  }

  const query = buildSearchQuery(params.city, params.state, params.category);

  const searchParams = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: String(params.maxResults || 10),
    order: "relevance",
    videoDuration: "medium", // 4-20 min — good for "things to do" content
    publishedAfter: getRecentDate(90), // last 90 days
    key: apiKey,
  });

  // Add location-based search if coordinates provided
  if (params.latitude && params.longitude) {
    searchParams.set("location", `${params.latitude},${params.longitude}`);
    searchParams.set("locationRadius", "50km");
  }

  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/search?${searchParams}`
    );

    if (!response.ok) {
      console.error(`YouTube search error: ${response.status}`);
      return [];
    }

    const data: YouTubeSearchResponse = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("YouTube search failed:", error);
    return [];
  }
}

/**
 * Get video statistics (views, likes) for a list of video IDs
 * Cost: 1 quota unit per call (very cheap!)
 */
export async function getYouTubeVideoStats(
  videoIds: string[]
): Promise<YouTubeVideoDetails[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || videoIds.length === 0) return [];

  const params = new URLSearchParams({
    part: "statistics",
    id: videoIds.join(","),
    key: apiKey,
  });

  try {
    const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.items || [];
  } catch {
    return [];
  }
}

/**
 * Parse YouTube search results into our standard social content format
 */
export function parseYouTubeResult(
  result: YouTubeSearchResult,
  stats?: YouTubeVideoDetails
) {
  return {
    platform: "YOUTUBE" as const,
    externalId: result.id.videoId,
    url: `https://www.youtube.com/watch?v=${result.id.videoId}`,
    embedHtml: null, // Use react-native-youtube-iframe for mobile
    title: result.snippet.title,
    description: result.snippet.description,
    thumbnail: result.snippet.thumbnails.high?.url || result.snippet.thumbnails.medium?.url,
    authorName: result.snippet.channelTitle,
    authorHandle: result.snippet.channelId,
    authorUrl: `https://www.youtube.com/channel/${result.snippet.channelId}`,
    viewCount: stats ? parseInt(stats.statistics.viewCount, 10) : null,
    likeCount: stats ? parseInt(stats.statistics.likeCount, 10) : null,
  };
}

// Helper: Build search query based on city and category
function buildSearchQuery(
  city: string,
  state: string,
  category?: string
): string {
  const categoryQueries: Record<string, string> = {
    outdoor: "outdoor activities hiking trails parks",
    dining: "best restaurants family friendly",
    entertainment: "things to do fun activities",
    free: "free things to do",
    adventure: "adventure activities",
    arts: "arts crafts activities kids",
  };

  const categoryText = category
    ? categoryQueries[category] || category
    : "things to do with family kids";

  return `${categoryText} in ${city} ${state} 2026`;
}

// Helper: Get ISO date string for N days ago
function getRecentDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}
