/**
 * Tests for /api/events and /api/events/[eventId]
 *
 * Covers: list events (GET), create event (POST), get single event,
 * update event (PUT), delete event (DELETE), validation, and error handling.
 */

import { prismaMock } from "../__mocks__/database";
import {
  mockRequest,
  resetAllMocks,
  parseJSON,
  mockRouteParams,
} from "../helpers";
import { GET as listEvents, POST as createEvent } from "@/app/api/events/route";
import {
  GET as getEvent,
  PUT as updateEvent,
  DELETE as deleteEvent,
} from "@/app/api/events/[eventId]/route";

beforeEach(() => {
  resetAllMocks();
});

// ---------------------------------------------------------------------------
// GET /api/events — list
// ---------------------------------------------------------------------------

describe("GET /api/events", () => {
  it("returns 400 when familyId is missing", async () => {
    const req = mockRequest("/api/events");
    const res = await listEvents(req);
    expect(res.status).toBe(400);

    const data = (await parseJSON(res)) as { error: string };
    expect(data.error).toMatch(/familyId/);
  });

  it("returns events for a family", async () => {
    const events = [
      {
        id: "evt-1",
        title: "Game Night",
        familyId: "fam-1",
        startTime: new Date(),
        attendees: [],
        creator: { id: "u1", name: "Alice", avatarUrl: null },
      },
    ];
    prismaMock.event.findMany.mockResolvedValue(events);

    const req = mockRequest("/api/events", {
      searchParams: { familyId: "fam-1" },
    });
    const res = await listEvents(req);
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as { events: unknown[] };
    expect(data.events).toHaveLength(1);
  });

  it("passes date range filters to Prisma", async () => {
    prismaMock.event.findMany.mockResolvedValue([]);

    const req = mockRequest("/api/events", {
      searchParams: {
        familyId: "fam-1",
        start: "2025-06-01T00:00:00Z",
        end: "2025-06-30T23:59:59Z",
      },
    });

    await listEvents(req);

    const where = prismaMock.event.findMany.mock.calls[0][0].where;
    expect(where.startTime.gte).toEqual(new Date("2025-06-01T00:00:00Z"));
    expect(where.startTime.lte).toEqual(new Date("2025-06-30T23:59:59Z"));
  });

  it("returns 500 on database error", async () => {
    prismaMock.event.findMany.mockRejectedValue(new Error("DB failure"));

    const req = mockRequest("/api/events", {
      searchParams: { familyId: "fam-1" },
    });
    const res = await listEvents(req);
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// POST /api/events — create
// ---------------------------------------------------------------------------

describe("POST /api/events", () => {
  const validBody = {
    familyId: "fam-1",
    title: "Park Day",
    startTime: "2025-07-01T10:00:00.000Z",
    endTime: "2025-07-01T12:00:00.000Z",
    category: "OUTDOOR",
    creatorId: "user-1",
  };

  it("returns 400 when validation fails (missing title)", async () => {
    const req = mockRequest("/api/events", {
      method: "POST",
      body: { familyId: "fam-1", startTime: "2025-07-01T10:00:00.000Z", endTime: "2025-07-01T12:00:00.000Z", creatorId: "u1" },
    });
    const res = await createEvent(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when creatorId is missing", async () => {
    const { creatorId, ...noCreator } = validBody;
    const req = mockRequest("/api/events", {
      method: "POST",
      body: noCreator,
    });
    const res = await createEvent(req);
    expect(res.status).toBe(400);

    const data = (await parseJSON(res)) as { error: string };
    expect(data.error).toMatch(/creatorId/);
  });

  it("creates event and returns 201", async () => {
    const created = {
      id: "evt-new",
      ...validBody,
      startTime: new Date(validBody.startTime),
      endTime: new Date(validBody.endTime),
      attendees: [],
      creator: { id: "user-1", name: "Bob", avatarUrl: null },
    };
    prismaMock.event.create.mockResolvedValue(created);

    const req = mockRequest("/api/events", {
      method: "POST",
      body: validBody,
    });
    const res = await createEvent(req);
    expect(res.status).toBe(201);

    const data = (await parseJSON(res)) as { event: { id: string } };
    expect(data.event.id).toBe("evt-new");
  });

  it("creates attendees when attendeeIds are provided", async () => {
    prismaMock.event.create.mockResolvedValue({
      id: "evt-att",
      attendees: [{ userId: "u2" }, { userId: "u3" }],
      creator: { id: "user-1", name: "Bob", avatarUrl: null },
    });

    const req = mockRequest("/api/events", {
      method: "POST",
      body: { ...validBody, attendeeIds: ["u2", "u3"] },
    });
    const res = await createEvent(req);
    expect(res.status).toBe(201);

    // Verify attendees were included in the create call
    const createArg = prismaMock.event.create.mock.calls[0][0];
    expect(createArg.data.attendees.create).toHaveLength(2);
  });

  it("returns 500 on database error", async () => {
    prismaMock.event.create.mockRejectedValue(new Error("DB failure"));

    const req = mockRequest("/api/events", {
      method: "POST",
      body: validBody,
    });
    const res = await createEvent(req);
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// GET /api/events/[eventId]
// ---------------------------------------------------------------------------

describe("GET /api/events/[eventId]", () => {
  it("returns 404 when event does not exist", async () => {
    prismaMock.event.findUnique.mockResolvedValue(null);

    const req = mockRequest("/api/events/evt-missing");
    const res = await getEvent(req, mockRouteParams({ eventId: "evt-missing" }));
    expect(res.status).toBe(404);
  });

  it("returns the event with attendees", async () => {
    const event = {
      id: "evt-1",
      title: "Picnic",
      attendees: [],
      creator: { id: "u1", name: "Alice", avatarUrl: null },
    };
    prismaMock.event.findUnique.mockResolvedValue(event);

    const req = mockRequest("/api/events/evt-1");
    const res = await getEvent(req, mockRouteParams({ eventId: "evt-1" }));
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as { event: { id: string } };
    expect(data.event.id).toBe("evt-1");
  });

  it("returns 500 on database error", async () => {
    prismaMock.event.findUnique.mockRejectedValue(new Error("DB failure"));

    const req = mockRequest("/api/events/evt-1");
    const res = await getEvent(req, mockRouteParams({ eventId: "evt-1" }));
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/events/[eventId]
// ---------------------------------------------------------------------------

describe("PUT /api/events/[eventId]", () => {
  it("returns 404 when event does not exist", async () => {
    prismaMock.event.findUnique.mockResolvedValue(null);

    const req = mockRequest("/api/events/evt-nope", {
      method: "PUT",
      body: { title: "Updated" },
    });
    const res = await updateEvent(req, mockRouteParams({ eventId: "evt-nope" }));
    expect(res.status).toBe(404);
  });

  it("updates allowed fields and returns the event", async () => {
    prismaMock.event.findUnique.mockResolvedValue({ id: "evt-1" });
    prismaMock.event.update.mockResolvedValue({
      id: "evt-1",
      title: "Updated Title",
      attendees: [],
      creator: { id: "u1", name: "Alice", avatarUrl: null },
    });

    const req = mockRequest("/api/events/evt-1", {
      method: "PUT",
      body: { title: "Updated Title", description: "New desc" },
    });
    const res = await updateEvent(req, mockRouteParams({ eventId: "evt-1" }));
    expect(res.status).toBe(200);

    const updateArg = prismaMock.event.update.mock.calls[0][0];
    expect(updateArg.data.title).toBe("Updated Title");
    expect(updateArg.data.description).toBe("New desc");
  });

  it("converts startTime and endTime to Date objects", async () => {
    prismaMock.event.findUnique.mockResolvedValue({ id: "evt-1" });
    prismaMock.event.update.mockResolvedValue({ id: "evt-1", attendees: [], creator: {} });

    const req = mockRequest("/api/events/evt-1", {
      method: "PUT",
      body: { startTime: "2025-08-01T09:00:00Z", endTime: "2025-08-01T11:00:00Z" },
    });
    await updateEvent(req, mockRouteParams({ eventId: "evt-1" }));

    const data = prismaMock.event.update.mock.calls[0][0].data;
    expect(data.startTime).toBeInstanceOf(Date);
    expect(data.endTime).toBeInstanceOf(Date);
  });

  it("returns 500 on database error", async () => {
    prismaMock.event.findUnique.mockResolvedValue({ id: "evt-1" });
    prismaMock.event.update.mockRejectedValue(new Error("DB failure"));

    const req = mockRequest("/api/events/evt-1", {
      method: "PUT",
      body: { title: "Boom" },
    });
    const res = await updateEvent(req, mockRouteParams({ eventId: "evt-1" }));
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/events/[eventId]
// ---------------------------------------------------------------------------

describe("DELETE /api/events/[eventId]", () => {
  it("returns 404 when event does not exist", async () => {
    prismaMock.event.findUnique.mockResolvedValue(null);

    const req = mockRequest("/api/events/evt-nope", { method: "DELETE" });
    const res = await deleteEvent(req, mockRouteParams({ eventId: "evt-nope" }));
    expect(res.status).toBe(404);
  });

  it("deletes the event and returns success message", async () => {
    prismaMock.event.findUnique.mockResolvedValue({ id: "evt-1" });
    prismaMock.event.delete.mockResolvedValue({ id: "evt-1" });

    const req = mockRequest("/api/events/evt-1", { method: "DELETE" });
    const res = await deleteEvent(req, mockRouteParams({ eventId: "evt-1" }));
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as { message: string };
    expect(data.message).toMatch(/deleted/i);
  });

  it("returns 500 on database error", async () => {
    prismaMock.event.findUnique.mockResolvedValue({ id: "evt-1" });
    prismaMock.event.delete.mockRejectedValue(new Error("DB failure"));

    const req = mockRequest("/api/events/evt-1", { method: "DELETE" });
    const res = await deleteEvent(req, mockRouteParams({ eventId: "evt-1" }));
    expect(res.status).toBe(500);
  });
});
