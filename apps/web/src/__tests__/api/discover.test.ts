/**
 * Tests for GET /api/discover
 *
 * Covers: location-based query, category/platform filters,
 * pagination, trending, grouped results, and error handling.
 */

import { prismaMock } from "../__mocks__/database";
import { mockRequest, resetAllMocks, parseJSON } from "../helpers";
import { GET as getDiscover } from "@/app/api/discover/route";

beforeEach(() => {
  resetAllMocks();
});

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

describe("GET /api/discover — validation", () => {
  it("returns 400 when neither city nor lat/lng is provided", async () => {
    const req = mockRequest("/api/discover");
    const res = await getDiscover(req);
    expect(res.status).toBe(400);

    const data = (await parseJSON(res)) as { error: string };
    expect(data.error).toMatch(/city.*lat/i);
  });

  it("returns 400 when lat is provided without lng", async () => {
    const req = mockRequest("/api/discover", {
      searchParams: { lat: "40.7" },
    });
    const res = await getDiscover(req);
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// Basic query
// ---------------------------------------------------------------------------

describe("GET /api/discover — city-based query", () => {
  beforeEach(() => {
    prismaMock.activity.findMany.mockResolvedValue([]);
    prismaMock.activity.count.mockResolvedValue(0);
    prismaMock.socialContent.findMany.mockResolvedValue([]);
  });

  it("returns 200 with empty results for a city with no data", async () => {
    const req = mockRequest("/api/discover", {
      searchParams: { city: "Smalltown", state: "KS" },
    });
    const res = await getDiscover(req);
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as {
      activities: unknown[];
      trending: unknown[];
      pagination: { total: number };
    };
    expect(data.activities).toEqual([]);
    expect(data.trending).toEqual([]);
    expect(data.pagination.total).toBe(0);
  });

  it("passes city and state filters case-insensitively", async () => {
    const req = mockRequest("/api/discover", {
      searchParams: { city: "Austin", state: "TX" },
    });
    await getDiscover(req);

    const where = prismaMock.activity.findMany.mock.calls[0][0].where;
    expect(where.city).toEqual({ equals: "Austin", mode: "insensitive" });
    expect(where.state).toEqual({ equals: "TX", mode: "insensitive" });
  });
});

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

describe("GET /api/discover — filters", () => {
  beforeEach(() => {
    prismaMock.activity.findMany.mockResolvedValue([]);
    prismaMock.activity.count.mockResolvedValue(0);
    prismaMock.socialContent.findMany.mockResolvedValue([]);
  });

  it("filters by category when valid", async () => {
    const req = mockRequest("/api/discover", {
      searchParams: { city: "Austin", category: "park" },
    });
    await getDiscover(req);

    const where = prismaMock.activity.findMany.mock.calls[0][0].where;
    expect(where.category).toBe("PARK");
  });

  it("ignores invalid category silently", async () => {
    const req = mockRequest("/api/discover", {
      searchParams: { city: "Austin", category: "INVALID" },
    });
    await getDiscover(req);

    const where = prismaMock.activity.findMany.mock.calls[0][0].where;
    expect(where.category).toBeUndefined();
  });

  it("filters social content by platform", async () => {
    const req = mockRequest("/api/discover", {
      searchParams: { city: "Austin", platform: "tiktok" },
    });
    await getDiscover(req);

    const socialWhere = prismaMock.socialContent.findMany.mock.calls[0][0].where;
    expect(socialWhere.platform).toBe("TIKTOK");
  });
});

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

describe("GET /api/discover — pagination", () => {
  beforeEach(() => {
    prismaMock.activity.findMany.mockResolvedValue([]);
    prismaMock.activity.count.mockResolvedValue(100);
    prismaMock.socialContent.findMany.mockResolvedValue([]);
  });

  it("defaults to page 1, limit 20", async () => {
    const req = mockRequest("/api/discover", {
      searchParams: { city: "Austin" },
    });
    await getDiscover(req);

    const findArgs = prismaMock.activity.findMany.mock.calls[0][0];
    expect(findArgs.skip).toBe(0);
    expect(findArgs.take).toBe(20);
  });

  it("respects page and limit parameters", async () => {
    const req = mockRequest("/api/discover", {
      searchParams: { city: "Austin", page: "3", limit: "10" },
    });
    await getDiscover(req);

    const findArgs = prismaMock.activity.findMany.mock.calls[0][0];
    expect(findArgs.skip).toBe(20); // (3-1)*10
    expect(findArgs.take).toBe(10);
  });

  it("caps limit at 50", async () => {
    const req = mockRequest("/api/discover", {
      searchParams: { city: "Austin", limit: "999" },
    });
    await getDiscover(req);

    const findArgs = prismaMock.activity.findMany.mock.calls[0][0];
    expect(findArgs.take).toBe(50);
  });

  it("enforces minimum page of 1", async () => {
    const req = mockRequest("/api/discover", {
      searchParams: { city: "Austin", page: "0" },
    });
    await getDiscover(req);

    const findArgs = prismaMock.activity.findMany.mock.calls[0][0];
    expect(findArgs.skip).toBe(0);
  });

  it("returns correct pagination metadata", async () => {
    const req = mockRequest("/api/discover", {
      searchParams: { city: "Austin", page: "2", limit: "10" },
    });
    const res = await getDiscover(req);
    const data = (await parseJSON(res)) as {
      pagination: { page: number; limit: number; total: number; totalPages: number };
    };

    expect(data.pagination.page).toBe(2);
    expect(data.pagination.limit).toBe(10);
    expect(data.pagination.total).toBe(100);
    expect(data.pagination.totalPages).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// Response shape
// ---------------------------------------------------------------------------

describe("GET /api/discover — response shape", () => {
  it("includes trending, activities, groupedByCategory, and pagination", async () => {
    prismaMock.activity.findMany.mockResolvedValue([
      {
        id: "a1",
        title: "Zilker Park",
        description: "Beautiful park",
        category: "PARK",
        cost: "FREE",
        rating: 4.5,
        reviewCount: 200,
        city: "Austin",
        state: "TX",
        imageUrl: null,
        isAffiliate: false,
        affiliateUrl: null,
        tags: ["park", "outdoor"],
        socialContent: [],
      },
    ]);
    prismaMock.activity.count.mockResolvedValue(1);
    prismaMock.socialContent.findMany.mockResolvedValue([
      {
        id: "sc1",
        platform: "TIKTOK",
        title: "Austin Parks",
        authorName: "ParkLover",
        authorHandle: "@parklover",
        viewCount: 50000,
        likeCount: 2000,
        thumbnail: "https://example.com/thumb.jpg",
        url: "https://tiktok.com/video",
        embedHtml: null,
        city: "Austin",
        state: "TX",
        activity: { id: "a1", title: "Zilker Park", category: "PARK" },
      },
    ]);

    const req = mockRequest("/api/discover", {
      searchParams: { city: "Austin", state: "TX" },
    });
    const res = await getDiscover(req);
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as {
      trending: { id: string; type: string }[];
      activities: { id: string; type: string }[];
      groupedByCategory: { category: string; count: number }[];
      pagination: { total: number };
    };

    expect(data.trending).toHaveLength(1);
    expect(data.trending[0].type).toBe("social");
    expect(data.activities).toHaveLength(1);
    expect(data.activities[0].type).toBe("place");
    expect(data.groupedByCategory).toHaveLength(1);
    expect(data.groupedByCategory[0].category).toBe("PARK");
    expect(data.pagination.total).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

describe("GET /api/discover — error handling", () => {
  it("returns 500 on database error", async () => {
    prismaMock.activity.findMany.mockRejectedValue(new Error("DB down"));
    prismaMock.activity.count.mockRejectedValue(new Error("DB down"));

    const req = mockRequest("/api/discover", {
      searchParams: { city: "Austin" },
    });
    const res = await getDiscover(req);
    expect(res.status).toBe(500);
  });
});
