import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";

type RouteParams = { params: Promise<{ familyId: string }> };

// GET /api/families/:familyId - Get family with all members
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { familyId } = await params;

  try {
    const family = await prisma.family.findUnique({
      where: { id: familyId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true, phone: true },
            },
          },
          orderBy: { joinedAt: "asc" },
        },
        _count: {
          select: { members: true, events: true },
        },
      },
    });

    if (!family) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 });
    }

    return NextResponse.json({ family });
  } catch (error) {
    console.error("Failed to fetch family:", error);
    return NextResponse.json({ error: "Failed to fetch family" }, { status: 500 });
  }
}

// PUT /api/families/:familyId - Update family name/color
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { familyId } = await params;

  try {
    const body = await request.json();

    const existing = await prisma.family.findUnique({ where: { id: familyId } });
    if (!existing) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.color !== undefined) updateData.color = body.color;

    const family = await prisma.family.update({
      where: { id: familyId },
      data: updateData,
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
        },
        _count: {
          select: { members: true },
        },
      },
    });

    return NextResponse.json({ family });
  } catch (error) {
    console.error("Failed to update family:", error);
    return NextResponse.json({ error: "Failed to update family" }, { status: 500 });
  }
}

// DELETE /api/families/:familyId - Delete family
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { familyId } = await params;

  try {
    const existing = await prisma.family.findUnique({ where: { id: familyId } });
    if (!existing) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 });
    }

    await prisma.family.delete({ where: { id: familyId } });

    return NextResponse.json({ message: "Family deleted" });
  } catch (error) {
    console.error("Failed to delete family:", error);
    return NextResponse.json({ error: "Failed to delete family" }, { status: 500 });
  }
}
