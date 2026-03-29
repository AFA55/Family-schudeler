import { NextRequest, NextResponse } from "next/server";

// GET /api/events - List events for a family
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const familyId = searchParams.get("familyId");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!familyId) {
    return NextResponse.json({ error: "familyId is required" }, { status: 400 });
  }

  // TODO: Connect to database
  // const events = await prisma.event.findMany({
  //   where: {
  //     familyId,
  //     startTime: { gte: new Date(start), lte: new Date(end) },
  //   },
  //   include: { attendees: { include: { user: true } } },
  //   orderBy: { startTime: "asc" },
  // });

  return NextResponse.json({ events: [], message: "API ready - connect database" });
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  const body = await request.json();

  // TODO: Validate with createEventSchema
  // TODO: Create event in database
  // TODO: Send notifications to attendees

  return NextResponse.json(
    { event: { id: "temp", ...body }, message: "API ready - connect database" },
    { status: 201 }
  );
}
