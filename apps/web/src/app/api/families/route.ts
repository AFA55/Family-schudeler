import { NextRequest, NextResponse } from "next/server";

// GET /api/families - List user's families
export async function GET() {
  // TODO: Get authenticated user
  // TODO: Query families from database

  return NextResponse.json({ families: [], message: "API ready - connect database" });
}

// POST /api/families - Create a new family
export async function POST(request: NextRequest) {
  const body = await request.json();

  // TODO: Validate with createFamilySchema
  // TODO: Create family in database
  // TODO: Add creator as ADMIN member

  return NextResponse.json(
    { family: { id: "temp", ...body }, message: "API ready - connect database" },
    { status: 201 }
  );
}
