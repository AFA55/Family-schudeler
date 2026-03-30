import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@familysync/database";

// PUT /api/notifications/mark-all-read?userId=X - Mark all unread notifications as read
export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({ updatedCount: result.count });
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
