/**
 * Tests for POST /api/stripe/checkout
 *
 * Covers: validation (missing fields, invalid plan/interval),
 * user lookup, Stripe customer creation, checkout session, and errors.
 */

import { prismaMock } from "../__mocks__/database";
import { mockRequest, resetAllMocks, parseJSON } from "../helpers";

// Mock the Stripe service module before importing the route
jest.mock("@/lib/services/stripe", () => ({
  createStripeCustomer: jest.fn().mockResolvedValue("cus_mock_123"),
  createCheckoutSession: jest
    .fn()
    .mockResolvedValue("https://checkout.stripe.com/session_mock"),
}));

import { POST as createCheckout } from "@/app/api/stripe/checkout/route";
import {
  createStripeCustomer,
  createCheckoutSession,
} from "@/lib/services/stripe";

const mockCreateCustomer = createStripeCustomer as jest.Mock;
const mockCreateSession = createCheckoutSession as jest.Mock;

beforeEach(() => {
  resetAllMocks();
  mockCreateCustomer.mockReset().mockResolvedValue("cus_mock_123");
  mockCreateSession
    .mockReset()
    .mockResolvedValue("https://checkout.stripe.com/session_mock");
});

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

describe("POST /api/stripe/checkout — validation", () => {
  it("returns 400 when userId is missing", async () => {
    const req = mockRequest("/api/stripe/checkout", {
      method: "POST",
      body: { plan: "PLUS", interval: "monthly" },
    });
    const res = await createCheckout(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when plan is missing", async () => {
    const req = mockRequest("/api/stripe/checkout", {
      method: "POST",
      body: { userId: "u1", interval: "monthly" },
    });
    const res = await createCheckout(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when interval is missing", async () => {
    const req = mockRequest("/api/stripe/checkout", {
      method: "POST",
      body: { userId: "u1", plan: "PLUS" },
    });
    const res = await createCheckout(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when plan is invalid", async () => {
    const req = mockRequest("/api/stripe/checkout", {
      method: "POST",
      body: { userId: "u1", plan: "MEGA", interval: "monthly" },
    });
    const res = await createCheckout(req);
    expect(res.status).toBe(400);

    const data = (await parseJSON(res)) as { error: string };
    expect(data.error).toMatch(/plan/i);
  });

  it("returns 400 when interval is invalid", async () => {
    const req = mockRequest("/api/stripe/checkout", {
      method: "POST",
      body: { userId: "u1", plan: "PLUS", interval: "weekly" },
    });
    const res = await createCheckout(req);
    expect(res.status).toBe(400);

    const data = (await parseJSON(res)) as { error: string };
    expect(data.error).toMatch(/interval/i);
  });
});

// ---------------------------------------------------------------------------
// User lookup
// ---------------------------------------------------------------------------

describe("POST /api/stripe/checkout — user lookup", () => {
  it("returns 404 when user does not exist", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const req = mockRequest("/api/stripe/checkout", {
      method: "POST",
      body: { userId: "ghost", plan: "PLUS", interval: "monthly" },
    });
    const res = await createCheckout(req);
    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// Stripe customer handling
// ---------------------------------------------------------------------------

describe("POST /api/stripe/checkout — Stripe customer", () => {
  const userWithSub = {
    id: "u1",
    email: "alice@test.com",
    name: "Alice",
    subscriptions: [{ stripeCustomerId: "cus_existing" }],
  };

  const userNoSub = {
    id: "u2",
    email: "bob@test.com",
    name: "Bob",
    subscriptions: [],
  };

  it("uses existing Stripe customer ID when available", async () => {
    prismaMock.user.findUnique.mockResolvedValue(userWithSub);

    const req = mockRequest("/api/stripe/checkout", {
      method: "POST",
      body: { userId: "u1", plan: "PLUS", interval: "monthly" },
    });
    await createCheckout(req);

    expect(mockCreateCustomer).not.toHaveBeenCalled();
    expect(mockCreateSession).toHaveBeenCalledWith(
      expect.objectContaining({ customerId: "cus_existing" })
    );
  });

  it("creates new Stripe customer when none exists", async () => {
    prismaMock.user.findUnique.mockResolvedValue(userNoSub);

    const req = mockRequest("/api/stripe/checkout", {
      method: "POST",
      body: { userId: "u2", plan: "PREMIUM", interval: "annual" },
    });
    await createCheckout(req);

    expect(mockCreateCustomer).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "bob@test.com",
        name: "Bob",
        userId: "u2",
      })
    );
    expect(mockCreateSession).toHaveBeenCalledWith(
      expect.objectContaining({ customerId: "cus_mock_123" })
    );
  });
});

// ---------------------------------------------------------------------------
// Success
// ---------------------------------------------------------------------------

describe("POST /api/stripe/checkout — success", () => {
  it("returns checkout URL", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      email: "a@t.com",
      name: "Alice",
      subscriptions: [{ stripeCustomerId: "cus_1" }],
    });

    const req = mockRequest("/api/stripe/checkout", {
      method: "POST",
      body: { userId: "u1", plan: "PLUS", interval: "monthly" },
    });
    const res = await createCheckout(req);
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as { url: string };
    expect(data.url).toBe("https://checkout.stripe.com/session_mock");
  });

  it("passes correct plan and interval to createCheckoutSession", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      email: "a@t.com",
      name: "Alice",
      subscriptions: [{ stripeCustomerId: "cus_1" }],
    });

    const req = mockRequest("/api/stripe/checkout", {
      method: "POST",
      body: { userId: "u1", plan: "PREMIUM", interval: "annual" },
    });
    await createCheckout(req);

    expect(mockCreateSession).toHaveBeenCalledWith(
      expect.objectContaining({ plan: "PREMIUM", interval: "annual" })
    );
  });
});

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

describe("POST /api/stripe/checkout — error handling", () => {
  it("returns 500 when user lookup fails", async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error("DB down"));

    const req = mockRequest("/api/stripe/checkout", {
      method: "POST",
      body: { userId: "u1", plan: "PLUS", interval: "monthly" },
    });
    const res = await createCheckout(req);
    expect(res.status).toBe(500);
  });

  it("returns 500 when Stripe checkout session creation fails", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      email: "a@t.com",
      name: "Alice",
      subscriptions: [{ stripeCustomerId: "cus_1" }],
    });
    mockCreateSession.mockRejectedValue(new Error("Stripe error"));

    const req = mockRequest("/api/stripe/checkout", {
      method: "POST",
      body: { userId: "u1", plan: "PLUS", interval: "monthly" },
    });
    const res = await createCheckout(req);
    expect(res.status).toBe(500);
  });
});
