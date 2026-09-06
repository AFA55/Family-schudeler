/**
 * Shared test helpers for API route tests.
 *
 * These utilities create mock NextRequest objects and provide authentication
 * stubs so every test file doesn't have to re-invent the plumbing.
 */

import { NextRequest } from "next/server";
import { prismaMock } from "./__mocks__/database";

// ---------------------------------------------------------------------------
// mockRequest — build a NextRequest suitable for passing to a route handler
// ---------------------------------------------------------------------------

interface MockRequestOptions {
  method?: string;
  body?: Record<string, unknown>;
  searchParams?: Record<string, string>;
  headers?: Record<string, string>;
}

/**
 * Create a NextRequest aimed at a given path.
 *
 * @param path   - URL path, e.g. "/api/events"
 * @param opts   - method, body (JSON), searchParams, headers
 */
export function mockRequest(
  path: string,
  opts: MockRequestOptions = {}
): NextRequest {
  const { method = "GET", body, searchParams, headers } = opts;

  const url = new URL(path, "http://localhost:3000");
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  const init: RequestInit = { method };

  if (body) {
    init.body = JSON.stringify(body);
    init.headers = { "Content-Type": "application/json", ...headers };
  } else if (headers) {
    init.headers = headers;
  }

  return new NextRequest(url.toString(), init as any);
}

// ---------------------------------------------------------------------------
// mockAuth — preset the Prisma user lookup so the route thinks a user exists
// ---------------------------------------------------------------------------

interface MockUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  passwordHash: string | null;
  emailVerified: Date | null;
  phone: string | null;
}

/**
 * Configure the prisma user mock so that `findUnique({ where: { id } })`
 * returns a plausible user object.  Returns the generated user for assertions.
 */
export function mockAuth(userId: string): MockUser {
  const user: MockUser = {
    id: userId,
    email: `${userId}@test.com`,
    name: "Test User",
    avatarUrl: null,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    passwordHash: null,
    emailVerified: null,
    phone: null,
  };

  prismaMock.user.findUnique.mockResolvedValue(user);
  return user;
}

// ---------------------------------------------------------------------------
// resetMocks — convenience to call in beforeEach so every test starts clean
// ---------------------------------------------------------------------------

export function resetAllMocks(): void {
  jest.restoreAllMocks();
  // Reset every mock on every model
  for (const model of Object.values(prismaMock)) {
    for (const fn of Object.values(model)) {
      if (typeof fn === "function" && "mockReset" in fn) {
        (fn as jest.Mock).mockReset();
      }
    }
  }
}

// ---------------------------------------------------------------------------
// mockRouteParams — build the { params: Promise<...> } shape Next.js 15 uses
// ---------------------------------------------------------------------------

export function mockRouteParams<T extends Record<string, string>>(
  params: T
): { params: Promise<T> } {
  return { params: Promise.resolve(params) };
}

// ---------------------------------------------------------------------------
// parseJSON — extract the JSON body from a NextResponse
// ---------------------------------------------------------------------------

export async function parseJSON(response: Response): Promise<unknown> {
  return response.json();
}
