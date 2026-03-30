import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";
import { createEventSchema } from "@familysync/shared";
import crypto from "crypto";

// GET /api/events - List events for a family
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const familyId = searchParams.get("familyId");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!familyId) {
    return NextResponse.json({ error: "familyId is required" }, { status: 400 });
  }

  try {
    const where: Record<string, unknown> = { familyId };

    if (start || end) {
      const startTime: Record<string, Date> = {};
      if (start) startTime.gte = new Date(start);
      if (end) startTime.lte = new Date(end);
      where.startTime = startTime;
    }

    const events = await prisma.event.findMany({
      where,
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
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = createEventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { attendeeIds, ...eventData } = parsed.data;

    // Require a creatorId from the request body
    const creatorId = body.creatorId;
    if (!creatorId) {
      return NextResponse.json({ error: "creatorId is required" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        ...eventData,
        startTime: new Date(eventData.startTime),
        endTime: new Date(eventData.endTime),
        creatorId,
        shareToken: body.isPublic ? crypto.randomUUID() : undefined,
        attendees: attendeeIds?.length
          ? {
              create: attendeeIds.map((userId: string) => ({
                userId,
                status: "PENDING" as const,
              })),
            }
          : undefined,
      },
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

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
