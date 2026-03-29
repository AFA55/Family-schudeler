/**
 * TikTok oEmbed Integration
 *
 * Uses TikTok's free oEmbed API — no authentication required.
 * Users paste a TikTok link → we fetch embed data and render it.
 *
 * Docs: https://developers.tiktok.com/doc/embed-videos/
 */

interface TikTokOEmbedResponse {
  version: string;
  type: string;
  title: string;
  author_url: string;
  author_name: string;
  width: string;
  height: string;
  html: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  provider_url: string;
  provider_name: string;
}

const TIKTOK_OEMBED_URL = "https://www.tiktok.com/oembed";

/**
 * Validate that a URL is a TikTok video URL
 */
export function isTikTokUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/,
    /^https?:\/\/vm\.tiktok\.com\/[\w]+/,
    /^https?:\/\/(www\.)?tiktok\.com\/t\/[\w]+/,
  ];
  return patterns.some((pattern) => pattern.test(url));
}

/**
 * Extract video ID from TikTok URL
 */
export function extractTikTokVideoId(url: string): string | null {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
}

/**
 * Fetch TikTok oEmbed data for a video URL
 * Free API — no auth required
 */
export async function getTikTokEmbed(
  videoUrl: string
): Promise<TikTokOEmbedResponse | null> {
  if (!isTikTokUrl(videoUrl)) {
    return null;
  }

  try {
    const params = new URLSearchParams({ url: videoUrl });
    const response = await fetch(`${TIKTOK_OEMBED_URL}?${params}`);

    if (!response.ok) {
      console.error(`TikTok oEmbed error: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("TikTok oEmbed fetch failed:", error);
    return null;
  }
}

/**
 * Parse TikTok oEmbed into our standard social content format
 */
export function parseTikTokEmbed(url: string, data: TikTokOEmbedResponse) {
  return {
    platform: "TIKTOK" as const,
    externalId: extractTikTokVideoId(url) || url,
    url,
    embedHtml: data.html,
    title: data.title,
    thumbnail: data.thumbnail_url,
    authorName: data.author_name,
    authorHandle: data.author_url.split("@")[1] || data.author_name,
    authorUrl: data.author_url,
  };
}
