import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";
import { createFamilySchema } from "@familysync/shared";
import crypto from "crypto";

// GET /api/families - List families user belongs to
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const memberships = await prisma.familyMember.findMany({
      where: { userId },
      include: {
        family: {
          include: {
            _count: {
              select: { members: true },
            },
          },
        },
      },
    });

    const families = memberships.map((m) => ({
      id: m.family.id,
      name: m.family.name,
      color: m.family.color,
      avatarUrl: m.family.avatarUrl,
      inviteCode: m.family.inviteCode,
      memberCount: m.family._count.members,
      role: m.role,
      joinedAt: m.joinedAt,
    }));

    return NextResponse.json({ families });
  } catch (error) {
    console.error("Failed to fetch families:", error);
    return NextResponse.json({ error: "Failed to fetch families" }, { status: 500 });
  }
}

// POST /api/families - Create a new family
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = createFamilySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, color } = parsed.data;
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const inviteCode = crypto.randomUUID().slice(0, 8).toUpperCase();

    const family = await prisma.family.create({
      data: {
        name,
        color,
        inviteCode,
        members: {
          create: {
            userId,
            role: "ADMIN",
          },
        },
      },
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

    return NextResponse.json({ family }, { status: 201 });
  } catch (error) {
    console.error("Failed to create family:", error);
    return NextResponse.json({ error: "Failed to create family" }, { status: 500 });
  }
}
