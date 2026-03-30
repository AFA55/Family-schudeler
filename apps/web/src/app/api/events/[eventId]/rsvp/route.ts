import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";

type RouteParams = { params: Promise<{ eventId: string }> };

// POST /api/events/:eventId/rsvp - RSVP to an event
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { eventId } = await params;

  try {
    const body = await request.json();
    const { userId, status } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const validStatuses = ["ACCEPTED", "DECLINED", "MAYBE"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Verify event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Upsert the attendee record
    const attendee = await prisma.eventAttendee.upsert({
      where: {
        eventId_userId: { eventId, userId },
      },
      update: { status },
      create: {
        eventId,
        userId,
        status,
      },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json({ attendee });
  } catch (error) {
    console.error("Failed to RSVP:", error);
    return NextResponse.json({ error: "Failed to RSVP" }, { status: 500 });
  }
}
