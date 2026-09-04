/**
 * Tests for POST /api/auth/signup
 *
 * Covers: validation (missing fields, invalid email, short password),
 * duplicate email detection, successful signup, and internal errors.
 */

import { prismaMock } from "../__mocks__/database";
import { mockRequest, resetAllMocks, parseJSON } from "../helpers";
import { POST } from "@/app/api/auth/signup/route";

// Mock bcryptjs so we don't do real hashing in tests
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password_123"),
}));

beforeEach(() => {
  resetAllMocks();
});

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

describe("POST /api/auth/signup — validation", () => {
  it("returns 400 when body is empty", async () => {
    const req = mockRequest("/api/auth/signup", {
      method: "POST",
      body: {},
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = (await parseJSON(res)) as { error: string };
    expect(data.error).toBe("Validation failed");
  });

  it("returns 400 when email is missing", async () => {
    const req = mockRequest("/api/auth/signup", {
      method: "POST",
      body: { name: "Alice", password: "securepass123" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when email is invalid", async () => {
    const req = mockRequest("/api/auth/signup", {
      method: "POST",
      body: { email: "not-an-email", name: "Alice", password: "securepass123" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when name is too short", async () => {
    const req = mockRequest("/api/auth/signup", {
      method: "POST",
      body: { email: "a@b.com", name: "A", password: "securepass123" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when password is too short", async () => {
    const req = mockRequest("/api/auth/signup", {
      method: "POST",
      body: { email: "a@b.com", name: "Alice", password: "short" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// Duplicate email
// ---------------------------------------------------------------------------

describe("POST /api/auth/signup — duplicate email", () => {
  it("returns 409 when email already exists", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "existing-user",
      email: "alice@test.com",
    });

    const req = mockRequest("/api/auth/signup", {
      method: "POST",
      body: { email: "Alice@Test.com", name: "Alice", password: "securepass123" },
    });

    const res = await POST(req);
    expect(res.status).toBe(409);

    const data = (await parseJSON(res)) as { error: string };
    expect(data.error).toMatch(/already exists/i);
  });
});

// ---------------------------------------------------------------------------
// Success
// ---------------------------------------------------------------------------

describe("POST /api/auth/signup — success", () => {
  it("creates user with FREE plan and 14-day trial, returns 201", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const createdUser = {
      id: "new-user-id",
      email: "alice@test.com",
      name: "Alice",
      createdAt: new Date(),
    };
    prismaMock.user.create.mockResolvedValue(createdUser);

    const req = mockRequest("/api/auth/signup", {
      method: "POST",
      body: { email: "Alice@Test.com", name: "Alice", password: "securepass123" },
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = (await parseJSON(res)) as { user: typeof createdUser };
    expect(data.user.email).toBe("alice@test.com");

    // Verify prisma.user.create was called with lowercased email
    const createCall = prismaMock.user.create.mock.calls[0][0];
    expect(createCall.data.email).toBe("alice@test.com");
    expect(createCall.data.subscriptions.create.plan).toBe("FREE");
    expect(createCall.data.subscriptions.create.status).toBe("TRIALING");
  });
});

// ---------------------------------------------------------------------------
// Internal error
// ---------------------------------------------------------------------------

describe("POST /api/auth/signup — server error", () => {
  it("returns 500 when prisma throws", async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error("DB down"));

    const req = mockRequest("/api/auth/signup", {
      method: "POST",
      body: { email: "a@b.com", name: "Alice", password: "securepass123" },
    });

    const res = await POST(req);
    expect(res.status).toBe(500);

    const data = (await parseJSON(res)) as { error: string };
    expect(data.error).toMatch(/unexpected/i);
  });
});
