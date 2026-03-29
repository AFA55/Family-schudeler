/**
 * Recreation.gov RIDB API Integration
 *
 * Free API — provides access to 120,000+ federal recreation areas.
 * Parks, trails, campgrounds, permits, and more.
 *
 * Docs: https://ridb.recreation.gov/docs
 */

interface RIDBFacility {
  FacilityID: string;
  FacilityName: string;
  FacilityDescription: string;
  FacilityTypeDescription: string;
  FacilityLatitude: number;
  FacilityLongitude: number;
  FacilityPhone: string;
  FacilityEmail: string;
  FacilityDirections: string;
  FacilityAdaAccess: string;
  Reservable: boolean;
  Enabled: boolean;
  LastUpdatedDate: string;
}

interface RIDBRecArea {
  RecAreaID: string;
  RecAreaName: string;
  RecAreaDescription: string;
  RecAreaLatitude: number;
  RecAreaLongitude: number;
  RecAreaPhone: string;
  RecAreaEmail: string;
  RecAreaDirections: string;
  LastUpdatedDate: string;
  ACTIVITY: Array<{
    ActivityID: number;
    ActivityName: string;
  }>;
}

const RIDB_BASE_URL = "https://ridb.recreation.gov/api/v1";

/**
 * Search for recreation areas near a location
 * Free API — just needs an API key from recreation.gov
 */
export async function searchRecAreas(params: {
  latitude: number;
  longitude: number;
  radius?: number; // miles
  limit?: number;
  activity?: string;
}): Promise<RIDBRecArea[]> {
  const apiKey = process.env.RIDB_API_KEY;
  if (!apiKey) {
    console.error("RIDB_API_KEY not configured");
    return [];
  }

  const searchParams = new URLSearchParams({
    latitude: String(params.latitude),
    longitude: String(params.longitude),
    radius: String(params.radius || 25),
    limit: String(params.limit || 20),
    apikey: apiKey,
  });

  if (params.activity) {
    searchParams.set("activity", params.activity);
  }

  try {
    const response = await fetch(
      `${RIDB_BASE_URL}/recareas?${searchParams}`
    );

    if (!response.ok) {
      console.error(`RIDB search error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.RECDATA || [];
  } catch (error) {
    console.error("RIDB search failed:", error);
    return [];
  }
}

/**
 * Search for facilities (campgrounds, trails, etc.) near a location
 */
export async function searchFacilities(params: {
  latitude: number;
  longitude: number;
  radius?: number;
  limit?: number;
}): Promise<RIDBFacility[]> {
  const apiKey = process.env.RIDB_API_KEY;
  if (!apiKey) return [];

  const searchParams = new URLSearchParams({
    latitude: String(params.latitude),
    longitude: String(params.longitude),
    radius: String(params.radius || 25),
    limit: String(params.limit || 20),
    apikey: apiKey,
  });

  try {
    const response = await fetch(
      `${RIDB_BASE_URL}/facilities?${searchParams}`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.RECDATA || [];
  } catch {
    return [];
  }
}

/**
 * Parse RIDB rec area into our standard activity format
 */
export function parseRecArea(recArea: RIDBRecArea) {
  const activities = recArea.ACTIVITY?.map((a) => a.ActivityName) || [];

  return {
    title: recArea.RecAreaName,
    description: cleanHtml(recArea.RecAreaDescription),
    category: categorizeRecArea(activities),
    latitude: recArea.RecAreaLatitude,
    longitude: recArea.RecAreaLongitude,
    cost: "FREE" as const,
    isOutdoor: true,
    isIndoor: false,
    tags: activities,
    provider: "ridb",
    externalId: recArea.RecAreaID,
  };
}

// Helper: Strip HTML tags from RIDB descriptions
function cleanHtml(html: string): string {
  return html?.replace(/<[^>]*>/g, "").trim() || "";
}

// Helper: Categorize rec area based on activities
function categorizeRecArea(
  activities: string[]
): string {
  const activityStr = activities.join(" ").toLowerCase();

  if (activityStr.includes("hiking") || activityStr.includes("trail")) return "TRAIL";
  if (activityStr.includes("camping")) return "CAMPGROUND";
  if (activityStr.includes("swimming") || activityStr.includes("beach")) return "OUTDOOR";
  if (activityStr.includes("playground")) return "PLAYGROUND";
  return "PARK";
}
