import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";
import { addFamilyMemberSchema } from "@familysync/shared";

type RouteParams = { params: Promise<{ familyId: string }> };

// POST /api/families/:familyId/members - Add member to family
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { familyId } = await params;

  try {
    const body = await request.json();

    const parsed = addFamilyMemberSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, name, phone, role } = parsed.data;

    // Verify family exists
    const family = await prisma.family.findUnique({ where: { id: familyId } });
    if (!family) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 });
    }

    // Find or create user by email
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name, phone },
      });
    }

    // Check if already a member
    const existingMember = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId, userId: user.id } },
    });
    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a member of this family" },
        { status: 409 }
      );
    }

    // Create the family member record
    const member = await prisma.familyMember.create({
      data: {
        familyId,
        userId: user.id,
        role,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true, phone: true },
        },
      },
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error("Failed to add member:", error);
    return NextResponse.json({ error: "Failed to add member" }, { status: 500 });
  }
}

// DELETE /api/families/:familyId/members - Remove member from family
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { familyId } = await params;

  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Verify member exists
    const member = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId, userId } },
    });
    if (!member) {
      return NextResponse.json({ error: "Member not found in this family" }, { status: 404 });
    }

    await prisma.familyMember.delete({
      where: { familyId_userId: { familyId, userId } },
    });

    return NextResponse.json({ message: "Member removed" });
  } catch (error) {
    console.error("Failed to remove member:", error);
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}
