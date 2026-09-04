import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";

// GET /api/chat/rooms?userId=X - List chat rooms for the user's families
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    // Find all families the user belongs to
    const memberships = await prisma.familyMember.findMany({
      where: { userId },
      select: { familyId: true },
    });

    if (memberships.length === 0) {
      return NextResponse.json({ rooms: [] });
    }

    const familyIds = memberships.map((m) => m.familyId);

    const rooms = await prisma.chatRoom.findMany({
      where: { familyId: { in: familyIds } },
      include: {
        family: {
          select: { id: true, name: true, color: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedRooms = rooms.map((room) => ({
      id: room.id,
      familyId: room.familyId,
      name: room.name,
      eventId: room.eventId,
      createdAt: room.createdAt,
      family: room.family,
      lastMessage: room.messages[0] ?? null,
      messageCount: room._count.messages,
    }));

    return NextResponse.json({ rooms: formattedRooms });
  } catch (error) {
    console.error("Failed to fetch chat rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat rooms" },
      { status: 500 }
    );
  }
}

// POST /api/chat/rooms - Create a new chat room
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { familyId, name, eventId, userId } = body;

    if (!familyId) {
      return NextResponse.json(
        { error: "familyId is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Verify the user is a member of this family
    const membership = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId, userId } },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this family" },
        { status: 403 }
      );
    }

    // If eventId is provided, verify the event belongs to this family
    if (eventId) {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!event || event.familyId !== familyId) {
        return NextResponse.json(
          { error: "Event not found in this family" },
          { status: 404 }
        );
      }
    }

    const room = await prisma.chatRoom.create({
      data: {
        familyId,
        name: name || null,
        eventId: eventId || null,
      },
      include: {
        family: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    console.error("Failed to create chat room:", error);
    return NextResponse.json(
      { error: "Failed to create chat room" },
      { status: 500 }
    );
  }
}
