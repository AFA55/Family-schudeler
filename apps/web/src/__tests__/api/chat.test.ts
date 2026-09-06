/**
 * Tests for /api/chat/rooms and /api/chat/ai
 *
 * Covers: list rooms, create room, AI endpoint validation,
 * membership verification, and mock AI responses.
 */

import { prismaMock } from "../__mocks__/database";
import { mockRequest, resetAllMocks, parseJSON } from "../helpers";
import {
  GET as listRooms,
  POST as createRoom,
} from "@/app/api/chat/rooms/route";
import { POST as chatAI } from "@/app/api/chat/ai/route";

beforeEach(() => {
  resetAllMocks();
});

// ===========================================================================
// GET /api/chat/rooms
// ===========================================================================

describe("GET /api/chat/rooms", () => {
  it("returns 400 when userId is missing", async () => {
    const req = mockRequest("/api/chat/rooms");
    const res = await listRooms(req);
    expect(res.status).toBe(400);
  });

  it("returns empty rooms when user has no families", async () => {
    prismaMock.familyMember.findMany.mockResolvedValue([]);

    const req = mockRequest("/api/chat/rooms", {
      searchParams: { userId: "user-1" },
    });
    const res = await listRooms(req);
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as { rooms: unknown[] };
    expect(data.rooms).toEqual([]);
  });

  it("returns formatted rooms with last message", async () => {
    prismaMock.familyMember.findMany.mockResolvedValue([
      { familyId: "fam-1" },
    ]);

    prismaMock.chatRoom.findMany.mockResolvedValue([
      {
        id: "room-1",
        familyId: "fam-1",
        name: "General",
        eventId: null,
        createdAt: new Date("2025-01-01"),
        family: { id: "fam-1", name: "Smiths", color: "#6366F1" },
        messages: [
          {
            id: "msg-1",
            content: "Hello!",
            createdAt: new Date(),
            sender: { id: "u1", name: "Alice", avatarUrl: null },
          },
        ],
        _count: { messages: 10 },
      },
    ]);

    const req = mockRequest("/api/chat/rooms", {
      searchParams: { userId: "user-1" },
    });
    const res = await listRooms(req);
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as {
      rooms: { id: string; lastMessage: { content: string } | null; messageCount: number }[];
    };
    expect(data.rooms).toHaveLength(1);
    expect(data.rooms[0].lastMessage?.content).toBe("Hello!");
    expect(data.rooms[0].messageCount).toBe(10);
  });

  it("returns 500 on database error", async () => {
    prismaMock.familyMember.findMany.mockRejectedValue(new Error("DB down"));

    const req = mockRequest("/api/chat/rooms", {
      searchParams: { userId: "user-1" },
    });
    const res = await listRooms(req);
    expect(res.status).toBe(500);
  });
});

// ===========================================================================
// POST /api/chat/rooms
// ===========================================================================

describe("POST /api/chat/rooms", () => {
  it("returns 400 when familyId is missing", async () => {
    const req = mockRequest("/api/chat/rooms", {
      method: "POST",
      body: { userId: "user-1" },
    });
    const res = await createRoom(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when userId is missing", async () => {
    const req = mockRequest("/api/chat/rooms", {
      method: "POST",
      body: { familyId: "fam-1" },
    });
    const res = await createRoom(req);
    expect(res.status).toBe(400);
  });

  it("returns 403 when user is not a family member", async () => {
    prismaMock.familyMember.findUnique.mockResolvedValue(null);

    const req = mockRequest("/api/chat/rooms", {
      method: "POST",
      body: { familyId: "fam-1", userId: "outsider" },
    });
    const res = await createRoom(req);
    expect(res.status).toBe(403);
  });

  it("returns 404 when eventId does not belong to the family", async () => {
    prismaMock.familyMember.findUnique.mockResolvedValue({ id: "m1" });
    prismaMock.event.findUnique.mockResolvedValue({
      id: "evt-other",
      familyId: "fam-other",
    });

    const req = mockRequest("/api/chat/rooms", {
      method: "POST",
      body: { familyId: "fam-1", userId: "user-1", eventId: "evt-other" },
    });
    const res = await createRoom(req);
    expect(res.status).toBe(404);
  });

  it("creates a room and returns 201", async () => {
    prismaMock.familyMember.findUnique.mockResolvedValue({ id: "m1" });
    prismaMock.chatRoom.create.mockResolvedValue({
      id: "room-new",
      familyId: "fam-1",
      name: "Planning",
      eventId: null,
      family: { id: "fam-1", name: "Smiths", color: "#6366F1" },
    });

    const req = mockRequest("/api/chat/rooms", {
      method: "POST",
      body: { familyId: "fam-1", userId: "user-1", name: "Planning" },
    });
    const res = await createRoom(req);
    expect(res.status).toBe(201);

    const data = (await parseJSON(res)) as { room: { id: string } };
    expect(data.room.id).toBe("room-new");
  });

  it("returns 500 on database error", async () => {
    prismaMock.familyMember.findUnique.mockResolvedValue({ id: "m1" });
    prismaMock.chatRoom.create.mockRejectedValue(new Error("DB down"));

    const req = mockRequest("/api/chat/rooms", {
      method: "POST",
      body: { familyId: "fam-1", userId: "user-1" },
    });
    const res = await createRoom(req);
    expect(res.status).toBe(500);
  });
});

// ===========================================================================
// POST /api/chat/ai
// ===========================================================================

describe("POST /api/chat/ai", () => {
  it("returns 400 when userId is missing", async () => {
    const req = mockRequest("/api/chat/ai", {
      method: "POST",
      body: { message: "hello", familyId: "fam-1" },
    });
    const res = await chatAI(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when message is missing", async () => {
    const req = mockRequest("/api/chat/ai", {
      method: "POST",
      body: { userId: "u1", familyId: "fam-1" },
    });
    const res = await chatAI(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when message is empty string", async () => {
    const req = mockRequest("/api/chat/ai", {
      method: "POST",
      body: { userId: "u1", familyId: "fam-1", message: "   " },
    });
    const res = await chatAI(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when familyId is missing", async () => {
    const req = mockRequest("/api/chat/ai", {
      method: "POST",
      body: { userId: "u1", message: "What should we do?" },
    });
    const res = await chatAI(req);
    expect(res.status).toBe(400);
  });

  it("returns 403 when user is not a family member", async () => {
    prismaMock.familyMember.findUnique.mockResolvedValue(null);

    const req = mockRequest("/api/chat/ai", {
      method: "POST",
      body: { userId: "outsider", familyId: "fam-1", message: "hello" },
    });
    const res = await chatAI(req);
    expect(res.status).toBe(403);
  });

  it("returns 404 when roomId does not belong to the family", async () => {
    prismaMock.familyMember.findUnique.mockResolvedValue({ id: "m1" });
    prismaMock.chatRoom.findUnique.mockResolvedValue({
      id: "room-other",
      familyId: "fam-other",
    });

    const req = mockRequest("/api/chat/ai", {
      method: "POST",
      body: {
        userId: "u1",
        familyId: "fam-1",
        message: "hello",
        roomId: "room-other",
      },
    });
    const res = await chatAI(req);
    expect(res.status).toBe(404);
  });

  it("returns AI reply with recommendations for outdoor query", async () => {
    prismaMock.familyMember.findUnique.mockResolvedValue({ id: "m1" });

    const req = mockRequest("/api/chat/ai", {
      method: "POST",
      body: {
        userId: "u1",
        familyId: "fam-1",
        message: "Let's go for a hike this weekend!",
      },
    });
    const res = await chatAI(req);
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as {
      reply: string;
      recommendations: { title: string }[];
      suggestedEvent: { title: string };
    };
    expect(data.reply).toBeDefined();
    expect(data.recommendations).toBeDefined();
    expect(data.recommendations.length).toBeGreaterThan(0);
    expect(data.suggestedEvent).toBeDefined();
  });

  it("returns default reply for generic message", async () => {
    prismaMock.familyMember.findUnique.mockResolvedValue({ id: "m1" });

    const req = mockRequest("/api/chat/ai", {
      method: "POST",
      body: {
        userId: "u1",
        familyId: "fam-1",
        message: "We need something for the weekend",
      },
    });
    const res = await chatAI(req);
    expect(res.status).toBe(200);

    const data = (await parseJSON(res)) as { reply: string };
    expect(data.reply).toBeDefined();
    expect(data.reply.length).toBeGreaterThan(0);
  });

  it("saves messages to chat room when roomId is provided", async () => {
    prismaMock.familyMember.findUnique.mockResolvedValue({ id: "m1" });
    prismaMock.chatRoom.findUnique.mockResolvedValue({
      id: "room-1",
      familyId: "fam-1",
    });
    prismaMock.chatMessage.createMany.mockResolvedValue({ count: 2 });

    const req = mockRequest("/api/chat/ai", {
      method: "POST",
      body: {
        userId: "u1",
        familyId: "fam-1",
        message: "Let's play a game!",
        roomId: "room-1",
      },
    });
    const res = await chatAI(req);
    expect(res.status).toBe(200);

    // Verify two messages saved: user message + AI response
    expect(prismaMock.chatMessage.createMany).toHaveBeenCalledTimes(1);
    const createArg = prismaMock.chatMessage.createMany.mock.calls[0][0];
    expect(createArg.data).toHaveLength(2);
    expect(createArg.data[0].isAI).toBe(false);
    expect(createArg.data[1].isAI).toBe(true);
  });

  it("returns 500 on database error", async () => {
    prismaMock.familyMember.findUnique.mockRejectedValue(new Error("DB down"));

    const req = mockRequest("/api/chat/ai", {
      method: "POST",
      body: { userId: "u1", familyId: "fam-1", message: "hello" },
    });
    const res = await chatAI(req);
    expect(res.status).toBe(500);
  });
});
