import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";

type RouteParams = { params: Promise<{ eventId: string }> };

// GET /api/events/:eventId - Get single event with attendees
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { eventId } = await params;

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        attendees: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
        },
        creator: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

// PUT /api/events/:eventId - Update event
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { eventId } = await params;

  try {
    const body = await request.json();

    const existing = await prisma.event.findUnique({ where: { id: eventId } });
    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "title", "description", "location", "allDay", "category",
      "color", "cost", "reminderMinutes", "isPublic",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (body.startTime) updateData.startTime = new Date(body.startTime);
    if (body.endTime) updateData.endTime = new Date(body.endTime);

    const event = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
      include: {
        attendees: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
        },
        creator: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Failed to update event:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

// DELETE /api/events/:eventId - Delete event
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { eventId } = await params;

  try {
    const existing = await prisma.event.findUnique({ where: { id: eventId } });
    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.event.delete({ where: { id: eventId } });

    return NextResponse.json({ message: "Event deleted" });
  } catch (error) {
    console.error("Failed to delete event:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
