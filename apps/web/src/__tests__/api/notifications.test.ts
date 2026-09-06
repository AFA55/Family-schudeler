/**
 * Tests for /api/notifications
 *
 * Covers: list notifications (GET), create notification (POST),
 * unreadOnly filter, validation, and error handling.
 */

import { prismaMock } from "../__mocks__/database";
import { mockRequest, resetAllMocks, parseJSON } from "../helpers";
import {
  GET as listNotifications,
  POST as createNotification,
} from "@/app/api/notifications/route";

beforeEach(() => {
  resetAllMocks();
});

// ---------------------------------------------------------------------------
// GET /api/notifications
// ---------------------------------------------------------------------------

describe("GET /api/notifications", () => {
  it("returns 400 when userId is missing", async () => {
    const req = mockRequest("/api/notifications");
    const res = await listNotifications(req);
    expect(res.status).toBe(400);

    const data = (await parseJSON(res)) as { error: string };
    expect(data.error).toMatch(/userId/);
  });

  it("returns notifications for a user", async () => {
    const notifications = [
      {
        id: "n1",
        userId: "u1",
        type: "EVENT_INVITE",
        title: "Game Night",
        body: "You are invited",
        read: false,
        createdAt: new Date(),
      },
      {
        id: "n2",
        userId: "u1",
        type: "SYSTEM",
        title: "Welcome",
        body: "Welcome to FamilySync",
        read: true,
        createdAt: new Date(),
      },
    ];
    prismaMock.notification.findMany.mockResolvedValue(notifications);

    const req = mockRequest("/api/notifications", {
      searchParams: { userId: "u1" },
    });
    const res = await listNotifications(req);
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as { notifications: unknown[] };
    expect(data.notifications).toHaveLength(2);
  });

  it("filters to unread only when unreadOnly=true", async () => {
    prismaMock.notification.findMany.mockResolvedValue([]);

    const req = mockRequest("/api/notifications", {
      searchParams: { userId: "u1", unreadOnly: "true" },
    });
    await listNotifications(req);

    const where = prismaMock.notification.findMany.mock.calls[0][0].where;
    expect(where.read).toBe(false);
  });

  it("does not filter by read status when unreadOnly is not set", async () => {
    prismaMock.notification.findMany.mockResolvedValue([]);

    const req = mockRequest("/api/notifications", {
      searchParams: { userId: "u1" },
    });
    await listNotifications(req);

    const where = prismaMock.notification.findMany.mock.calls[0][0].where;
    expect(where.read).toBeUndefined();
  });

  it("returns 500 on database error", async () => {
    prismaMock.notification.findMany.mockRejectedValue(new Error("DB down"));

    const req = mockRequest("/api/notifications", {
      searchParams: { userId: "u1" },
    });
    const res = await listNotifications(req);
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// POST /api/notifications
// ---------------------------------------------------------------------------

describe("POST /api/notifications", () => {
  const validBody = {
    userId: "u1",
    type: "EVENT_INVITE" as const,
    title: "Game Night Invite",
    body: "You have been invited to Game Night!",
  };

  it("returns 400 when userId is missing", async () => {
    const { userId, ...noUser } = validBody;
    const req = mockRequest("/api/notifications", {
      method: "POST",
      body: noUser,
    });
    const res = await createNotification(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when type is invalid", async () => {
    const req = mockRequest("/api/notifications", {
      method: "POST",
      body: { ...validBody, type: "INVALID_TYPE" },
    });
    const res = await createNotification(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when title is missing", async () => {
    const { title, ...noTitle } = validBody;
    const req = mockRequest("/api/notifications", {
      method: "POST",
      body: noTitle,
    });
    const res = await createNotification(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when body is missing", async () => {
    const { body: bodyField, ...noBody } = validBody;
    const req = mockRequest("/api/notifications", {
      method: "POST",
      body: noBody,
    });
    const res = await createNotification(req);
    expect(res.status).toBe(400);
  });

  it("creates notification and returns 201", async () => {
    const created = {
      id: "n-new",
      ...validBody,
      read: false,
      data: null,
      createdAt: new Date(),
    };
    prismaMock.notification.create.mockResolvedValue(created);

    const req = mockRequest("/api/notifications", {
      method: "POST",
      body: validBody,
    });
    const res = await createNotification(req);
    expect(res.status).toBe(201);

    const data = (await parseJSON(res)) as { notification: { id: string } };
    expect(data.notification.id).toBe("n-new");
  });

  it("accepts optional data field", async () => {
    const bodyWithData = { ...validBody, data: { eventId: "evt-1" } };
    prismaMock.notification.create.mockResolvedValue({
      id: "n-data",
      ...bodyWithData,
      read: false,
      createdAt: new Date(),
    });

    const req = mockRequest("/api/notifications", {
      method: "POST",
      body: bodyWithData,
    });
    const res = await createNotification(req);
    expect(res.status).toBe(201);
  });

  it("returns 500 on database error", async () => {
    prismaMock.notification.create.mockRejectedValue(new Error("DB down"));

    const req = mockRequest("/api/notifications", {
      method: "POST",
      body: validBody,
    });
    const res = await createNotification(req);
    expect(res.status).toBe(500);
  });
});
