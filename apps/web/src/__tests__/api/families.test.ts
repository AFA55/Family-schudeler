/**
 * Tests for /api/families and /api/families/[familyId]
 *
 * Covers: list families for a user, create family, get single family,
 * update family, delete family, validation, and error handling.
 */

import { prismaMock } from "../__mocks__/database";
import {
  mockRequest,
  resetAllMocks,
  parseJSON,
  mockRouteParams,
} from "../helpers";
import {
  GET as listFamilies,
  POST as createFamily,
} from "@/app/api/families/route";
import {
  GET as getFamily,
  PUT as updateFamily,
  DELETE as deleteFamily,
} from "@/app/api/families/[familyId]/route";

// Mock crypto.randomUUID for deterministic invite codes
jest.spyOn(globalThis.crypto, "randomUUID").mockReturnValue(
  "abcd1234-5678-9abc-def0-123456789abc"
);

beforeEach(() => {
  resetAllMocks();
});

// ---------------------------------------------------------------------------
// GET /api/families
// ---------------------------------------------------------------------------

describe("GET /api/families", () => {
  it("returns 400 when userId is missing", async () => {
    const req = mockRequest("/api/families");
    const res = await listFamilies(req);
    expect(res.status).toBe(400);

    const data = (await parseJSON(res)) as { error: string };
    expect(data.error).toMatch(/userId/);
  });

  it("returns families for a user", async () => {
    prismaMock.familyMember.findMany.mockResolvedValue([
      {
        role: "ADMIN",
        joinedAt: new Date(),
        family: {
          id: "fam-1",
          name: "The Smiths",
          color: "#6366F1",
          avatarUrl: null,
          inviteCode: "ABCD1234",
          _count: { members: 3 },
        },
      },
    ]);

    const req = mockRequest("/api/families", {
      searchParams: { userId: "user-1" },
    });
    const res = await listFamilies(req);
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as { families: { name: string }[] };
    expect(data.families).toHaveLength(1);
    expect(data.families[0].name).toBe("The Smiths");
  });

  it("returns empty array when user has no families", async () => {
    prismaMock.familyMember.findMany.mockResolvedValue([]);

    const req = mockRequest("/api/families", {
      searchParams: { userId: "user-lonely" },
    });
    const res = await listFamilies(req);
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as { families: unknown[] };
    expect(data.families).toEqual([]);
  });

  it("returns 500 on database error", async () => {
    prismaMock.familyMember.findMany.mockRejectedValue(new Error("DB down"));

    const req = mockRequest("/api/families", {
      searchParams: { userId: "user-1" },
    });
    const res = await listFamilies(req);
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// POST /api/families
// ---------------------------------------------------------------------------

describe("POST /api/families", () => {
  it("returns 400 when validation fails (missing name)", async () => {
    const req = mockRequest("/api/families", {
      method: "POST",
      body: { color: "#FF6B6B", userId: "user-1" },
    });
    const res = await createFamily(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when color is invalid", async () => {
    const req = mockRequest("/api/families", {
      method: "POST",
      body: { name: "The Smiths", color: "not-a-color", userId: "user-1" },
    });
    const res = await createFamily(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when userId is missing", async () => {
    const req = mockRequest("/api/families", {
      method: "POST",
      body: { name: "The Smiths", color: "#6366F1" },
    });
    const res = await createFamily(req);
    expect(res.status).toBe(400);

    const data = (await parseJSON(res)) as { error: string };
    expect(data.error).toMatch(/userId/);
  });

  it("creates family with ADMIN role and returns 201", async () => {
    const createdFamily = {
      id: "fam-new",
      name: "The Smiths",
      color: "#6366F1",
      inviteCode: "ABCD1234",
      members: [
        {
          userId: "user-1",
          role: "ADMIN",
          user: { id: "user-1", name: "Alice", email: "alice@test.com", avatarUrl: null },
        },
      ],
      _count: { members: 1 },
    };
    prismaMock.family.create.mockResolvedValue(createdFamily);

    const req = mockRequest("/api/families", {
      method: "POST",
      body: { name: "The Smiths", color: "#6366F1", userId: "user-1" },
    });
    const res = await createFamily(req);
    expect(res.status).toBe(201);

    const data = (await parseJSON(res)) as { family: { id: string } };
    expect(data.family.id).toBe("fam-new");

    // Verify creator was added as ADMIN
    const createArg = prismaMock.family.create.mock.calls[0][0];
    expect(createArg.data.members.create.role).toBe("ADMIN");
  });

  it("returns 500 on database error", async () => {
    prismaMock.family.create.mockRejectedValue(new Error("DB down"));

    const req = mockRequest("/api/families", {
      method: "POST",
      body: { name: "Broken", color: "#6366F1", userId: "user-1" },
    });
    const res = await createFamily(req);
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// GET /api/families/[familyId]
// ---------------------------------------------------------------------------

describe("GET /api/families/[familyId]", () => {
  it("returns 404 when family does not exist", async () => {
    prismaMock.family.findUnique.mockResolvedValue(null);

    const req = mockRequest("/api/families/fam-missing");
    const res = await getFamily(req, mockRouteParams({ familyId: "fam-missing" }));
    expect(res.status).toBe(404);
  });

  it("returns family with members", async () => {
    const family = {
      id: "fam-1",
      name: "The Smiths",
      members: [
        {
          userId: "u1",
          role: "ADMIN",
          user: { id: "u1", name: "Alice", email: "a@t.com", avatarUrl: null, phone: null },
        },
      ],
      _count: { members: 1, events: 5 },
    };
    prismaMock.family.findUnique.mockResolvedValue(family);

    const req = mockRequest("/api/families/fam-1");
    const res = await getFamily(req, mockRouteParams({ familyId: "fam-1" }));
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as { family: { name: string } };
    expect(data.family.name).toBe("The Smiths");
  });

  it("returns 500 on database error", async () => {
    prismaMock.family.findUnique.mockRejectedValue(new Error("DB down"));

    const req = mockRequest("/api/families/fam-1");
    const res = await getFamily(req, mockRouteParams({ familyId: "fam-1" }));
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/families/[familyId]
// ---------------------------------------------------------------------------

describe("PUT /api/families/[familyId]", () => {
  it("returns 404 when family does not exist", async () => {
    prismaMock.family.findUnique.mockResolvedValue(null);

    const req = mockRequest("/api/families/fam-nope", {
      method: "PUT",
      body: { name: "Updated" },
    });
    const res = await updateFamily(req, mockRouteParams({ familyId: "fam-nope" }));
    expect(res.status).toBe(404);
  });

  it("updates name and color", async () => {
    prismaMock.family.findUnique.mockResolvedValue({ id: "fam-1" });
    prismaMock.family.update.mockResolvedValue({
      id: "fam-1",
      name: "New Name",
      color: "#FF6B6B",
      members: [],
      _count: { members: 1 },
    });

    const req = mockRequest("/api/families/fam-1", {
      method: "PUT",
      body: { name: "New Name", color: "#FF6B6B" },
    });
    const res = await updateFamily(req, mockRouteParams({ familyId: "fam-1" }));
    expect(res.status).toBe(200);

    const updateArg = prismaMock.family.update.mock.calls[0][0];
    expect(updateArg.data.name).toBe("New Name");
    expect(updateArg.data.color).toBe("#FF6B6B");
  });

  it("returns 500 on database error", async () => {
    prismaMock.family.findUnique.mockResolvedValue({ id: "fam-1" });
    prismaMock.family.update.mockRejectedValue(new Error("DB down"));

    const req = mockRequest("/api/families/fam-1", {
      method: "PUT",
      body: { name: "Boom" },
    });
    const res = await updateFamily(req, mockRouteParams({ familyId: "fam-1" }));
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/families/[familyId]
// ---------------------------------------------------------------------------

describe("DELETE /api/families/[familyId]", () => {
  it("returns 404 when family does not exist", async () => {
    prismaMock.family.findUnique.mockResolvedValue(null);

    const req = mockRequest("/api/families/fam-nope", { method: "DELETE" });
    const res = await deleteFamily(req, mockRouteParams({ familyId: "fam-nope" }));
    expect(res.status).toBe(404);
  });

  it("deletes the family and returns success message", async () => {
    prismaMock.family.findUnique.mockResolvedValue({ id: "fam-1" });
    prismaMock.family.delete.mockResolvedValue({ id: "fam-1" });

    const req = mockRequest("/api/families/fam-1", { method: "DELETE" });
    const res = await deleteFamily(req, mockRouteParams({ familyId: "fam-1" }));
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as { message: string };
    expect(data.message).toMatch(/deleted/i);
  });

  it("returns 500 on database error", async () => {
    prismaMock.family.findUnique.mockResolvedValue({ id: "fam-1" });
    prismaMock.family.delete.mockRejectedValue(new Error("DB down"));

    const req = mockRequest("/api/families/fam-1", { method: "DELETE" });
    const res = await deleteFamily(req, mockRouteParams({ familyId: "fam-1" }));
    expect(res.status).toBe(500);
  });
});
