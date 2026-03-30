import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";

type RouteParams = { params: Promise<{ inviteCode: string }> };

// POST /api/families/join/:inviteCode - Join a family via invite code
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { inviteCode } = await params;

  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Find family by invite code
    const family = await prisma.family.findUnique({
      where: { inviteCode },
    });
    if (!family) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
    }

    // Check if user is already a member
    const existingMember = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId: family.id, userId } },
    });
    if (existingMember) {
      return NextResponse.json(
        { error: "You are already a member of this family" },
        { status: 409 }
      );
    }

    // Create member with MEMBER role
    await prisma.familyMember.create({
      data: {
        familyId: family.id,
        userId,
        role: "MEMBER",
      },
    });

    // Return the family with members
    const updatedFamily = await prisma.family.findUnique({
      where: { id: family.id },
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

    return NextResponse.json({ family: updatedFamily }, { status: 201 });
  } catch (error) {
    console.error("Failed to join family:", error);
    return NextResponse.json({ error: "Failed to join family" }, { status: 500 });
  }
}
