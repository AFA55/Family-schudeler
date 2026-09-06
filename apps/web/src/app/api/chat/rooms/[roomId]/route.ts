import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";

type RouteParams = { params: Promise<{ roomId: string }> };

// GET /api/chat/rooms/:roomId - Get room details
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { roomId } = await params;

  try {
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        family: {
          select: { id: true, name: true, color: true },
        },
        _count: {
          select: { messages: true },
        },
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Chat room not found" }, { status: 404 });
    }

    return NextResponse.json({ room });
  } catch (error) {
    console.error("Failed to fetch chat room:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat room" },
      { status: 500 }
    );
  }
}

// DELETE /api/chat/rooms/:roomId - Delete a room (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { roomId } = await params;

  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Find the room
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Chat room not found" },
        { status: 404 }
      );
    }

    // Verify the user is an ADMIN of the family that owns this room
    const membership = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId: room.familyId, userId } },
    });

    if (!membership || membership.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only family admins can delete chat rooms" },
        { status: 403 }
      );
    }

    await prisma.chatRoom.delete({ where: { id: roomId } });

    return NextResponse.json({ message: "Chat room deleted" });
  } catch (error) {
    console.error("Failed to delete chat room:", error);
    return NextResponse.json(
      { error: "Failed to delete chat room" },
      { status: 500 }
    );
  }
}
