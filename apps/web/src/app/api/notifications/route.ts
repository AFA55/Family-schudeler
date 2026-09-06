import { NextRequest, NextResponse } from "next/server";
import { prisma, NotificationType } from "@familysync/database";
import { z } from "zod";

const VALID_NOTIFICATION_TYPES: NotificationType[] = [
  "EVENT_INVITE",
  "EVENT_REMINDER",
  "EVENT_UPDATE",
  "FAMILY_INVITE",
  "RECOMMENDATION",
  "CHAT_MESSAGE",
  "SYSTEM",
];

const createNotificationSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  type: z.enum([
    "EVENT_INVITE",
    "EVENT_REMINDER",
    "EVENT_UPDATE",
    "FAMILY_INVITE",
    "RECOMMENDATION",
    "CHAT_MESSAGE",
    "SYSTEM",
  ]),
  title: z.string().min(1, "title is required"),
  body: z.string().min(1, "body is required"),
  data: z.record(z.unknown()).optional(),
});

// GET /api/notifications?userId=X&unreadOnly=true
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const unreadOnly = searchParams.get("unreadOnly") === "true";

  if (!userId) {
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 }
    );
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { read: false } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create a notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = createNotificationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, type, title, body: notificationBody, data } = parsed.data;

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body: notificationBody,
        data: (data ?? undefined) as any,
      },
    });

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    console.error("Failed to create notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
