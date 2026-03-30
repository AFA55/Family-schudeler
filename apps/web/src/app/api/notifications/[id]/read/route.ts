import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";

// PUT /api/notifications/:id/read - Mark a single notification as read
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Notification ID is required" },
      { status: 400 }
    );
  }

  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return NextResponse.json({ notification });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }
    console.error("Failed to mark notification as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
