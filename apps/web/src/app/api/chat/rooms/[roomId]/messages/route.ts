import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";

type RouteParams = { params: Promise<{ roomId: string }> };

// GET /api/chat/rooms/:roomId/messages?userId=X&cursor=Y&limit=Z
// Cursor-based pagination: returns messages older than cursor
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { roomId } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const cursor = searchParams.get("cursor");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    // Verify the room exists
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      select: { id: true, familyId: true },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Chat room not found" },
        { status: 404 }
      );
    }

    // Verify the user is a member of the family that owns this room
    const membership = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId: room.familyId, userId } },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this family" },
        { status: 403 }
      );
    }

    // Build query with cursor-based pagination
    const messages = await prisma.chatMessage.findMany({
      where: { chatRoomId: roomId },
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1, // fetch one extra to determine if there are more
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1, // skip the cursor itself
          }
        : {}),
    });

    const hasMore = messages.length > limit;
    const resultMessages = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = hasMore
      ? resultMessages[resultMessages.length - 1]?.id
      : null;

    return NextResponse.json({
      messages: resultMessages,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/chat/rooms/:roomId/messages - Send a message
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { roomId } = await params;

  try {
    const body = await request.json();
    const { content, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "content is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Verify the room exists
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      select: { id: true, familyId: true },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Chat room not found" },
        { status: 404 }
      );
    }

    // Verify the user is a member of the family that owns this room
    const membership = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId: room.familyId, userId } },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this family" },
        { status: 403 }
      );
    }

    const message = await prisma.chatMessage.create({
      data: {
        chatRoomId: roomId,
        senderId: userId,
        content: content.trim(),
      },
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
