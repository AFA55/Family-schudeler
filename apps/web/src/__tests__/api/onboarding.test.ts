/**
 * Tests for /api/onboarding
 *
 * Covers: GET onboarding data, POST onboarding survey,
 * validation, upsert behavior, and error handling.
 */

import { prismaMock } from "../__mocks__/database";
import { mockRequest, resetAllMocks, parseJSON } from "../helpers";
import {
  GET as getOnboarding,
  POST as submitOnboarding,
} from "@/app/api/onboarding/route";

beforeEach(() => {
  resetAllMocks();
});

// ---------------------------------------------------------------------------
// GET /api/onboarding
// ---------------------------------------------------------------------------

describe("GET /api/onboarding", () => {
  it("returns 400 when userId is missing", async () => {
    const req = mockRequest("/api/onboarding");
    const res = await getOnboarding(req);
    expect(res.status).toBe(400);

    const data = (await parseJSON(res)) as { error: string };
    expect(data.error).toMatch(/userId/);
  });

  it("returns 404 when no onboarding data exists", async () => {
    prismaMock.userOnboarding.findUnique.mockResolvedValue(null);

    const req = mockRequest("/api/onboarding", {
      searchParams: { userId: "u1" },
    });
    const res = await getOnboarding(req);
    expect(res.status).toBe(404);
  });

  it("returns onboarding data for a user", async () => {
    const onboarding = {
      id: "ob-1",
      userId: "u1",
      interests: ["hiking", "cooking"],
      currentActivities: ["park visits"],
      goals: ["more family time"],
      wantRecommendations: true,
      activityTypes: ["outdoor"],
      maxTravelDistance: 50,
      address: null,
      preferredBudget: "moderate",
      helpCountryPreference: ["US"],
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaMock.userOnboarding.findUnique.mockResolvedValue(onboarding);

    const req = mockRequest("/api/onboarding", {
      searchParams: { userId: "u1" },
    });
    const res = await getOnboarding(req);
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as {
      onboarding: { interests: string[] };
    };
    expect(data.onboarding.interests).toEqual(["hiking", "cooking"]);
  });

  it("returns 500 on database error", async () => {
    prismaMock.userOnboarding.findUnique.mockRejectedValue(
      new Error("DB down")
    );

    const req = mockRequest("/api/onboarding", {
      searchParams: { userId: "u1" },
    });
    const res = await getOnboarding(req);
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// POST /api/onboarding
// ---------------------------------------------------------------------------

describe("POST /api/onboarding", () => {
  const validBody = {
    userId: "u1",
    interests: ["hiking"],
    currentActivities: ["park visits"],
    goals: ["more family time"],
    wantRecommendations: true,
    activityTypes: ["outdoor"],
    helpCountryPreference: ["US"],
  };

  it("returns 400 when userId is missing", async () => {
    const { userId, ...noUser } = validBody;
    const req = mockRequest("/api/onboarding", {
      method: "POST",
      body: noUser,
    });
    const res = await submitOnboarding(req);
    expect(res.status).toBe(400);

    const data = (await parseJSON(res)) as { error: string };
    expect(data.error).toMatch(/userId/);
  });

  it("returns 400 when interests is empty", async () => {
    const req = mockRequest("/api/onboarding", {
      method: "POST",
      body: { ...validBody, interests: [] },
    });
    const res = await submitOnboarding(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when goals is empty", async () => {
    const req = mockRequest("/api/onboarding", {
      method: "POST",
      body: { ...validBody, goals: [] },
    });
    const res = await submitOnboarding(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when wantRecommendations is missing", async () => {
    const { wantRecommendations, ...noWant } = validBody;
    const req = mockRequest("/api/onboarding", {
      method: "POST",
      body: noWant,
    });
    const res = await submitOnboarding(req);
    expect(res.status).toBe(400);
  });

  it("creates onboarding and returns 201", async () => {
    const created = {
      id: "ob-new",
      userId: "u1",
      interests: ["hiking"],
      completedAt: new Date(),
    };
    prismaMock.userOnboarding.upsert.mockResolvedValue(created);

    const req = mockRequest("/api/onboarding", {
      method: "POST",
      body: validBody,
    });
    const res = await submitOnboarding(req);
    expect(res.status).toBe(201);

    const data = (await parseJSON(res)) as {
      onboarding: { id: string };
    };
    expect(data.onboarding.id).toBe("ob-new");
  });

  it("uses upsert so re-submitting updates instead of erroring", async () => {
    prismaMock.userOnboarding.upsert.mockResolvedValue({
      id: "ob-1",
      userId: "u1",
    });

    const req = mockRequest("/api/onboarding", {
      method: "POST",
      body: validBody,
    });
    await submitOnboarding(req);

    expect(prismaMock.userOnboarding.upsert).toHaveBeenCalledTimes(1);
    const upsertArg = prismaMock.userOnboarding.upsert.mock.calls[0][0];
    expect(upsertArg.where.userId).toBe("u1");
    expect(upsertArg.create.userId).toBe("u1");
  });

  it("accepts optional fields (maxTravelDistance, address, preferredBudget)", async () => {
    prismaMock.userOnboarding.upsert.mockResolvedValue({ id: "ob-1" });

    const bodyWithOptionals = {
      ...validBody,
      maxTravelDistance: 100,
      address: "123 Main St",
      preferredBudget: "budget",
    };
    const req = mockRequest("/api/onboarding", {
      method: "POST",
      body: bodyWithOptionals,
    });
    const res = await submitOnboarding(req);
    expect(res.status).toBe(201);
  });

  it("returns 500 on database error", async () => {
    prismaMock.userOnboarding.upsert.mockRejectedValue(new Error("DB down"));

    const req = mockRequest("/api/onboarding", {
      method: "POST",
      body: validBody,
    });
    const res = await submitOnboarding(req);
    expect(res.status).toBe(500);
  });
});
