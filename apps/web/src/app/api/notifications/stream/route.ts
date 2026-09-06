import { NextRequest } from "next/server";
import { prisma } from "@familysync/database";

// GET /api/notifications/stream?userId=X — SSE stream for real-time notifications
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get("userId");

  if (!userIdParam) {
    return new Response(JSON.stringify({ error: "userId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userId = userIdParam;

  // Verify the user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const POLL_INTERVAL_MS = 5_000;
  const HEARTBEAT_INTERVAL_MS = 15_000;

  const stream = new ReadableStream({
    start(controller) {
      let lastCheckedAt = new Date();
      let closed = false;
      let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
      let pollTimer: ReturnType<typeof setInterval> | null = null;

      const encoder = new TextEncoder();

      function send(event: string, data: unknown) {
        if (closed) return;
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          cleanup();
        }
      }

      async function poll() {
        if (closed) return;

        try {
          // Fetch unread notifications newer than last check
          const newNotifications = await prisma.notification.findMany({
            where: {
              userId,
              read: false,
              createdAt: { gt: lastCheckedAt },
            },
            orderBy: { createdAt: "asc" },
          });

          for (const notification of newNotifications) {
            send("notification", notification);
          }

          lastCheckedAt = new Date();
        } catch (error) {
          console.error("SSE notifications poll error:", error);
        }
      }

      async function sendHeartbeatWithCount() {
        if (closed) return;

        try {
          const unreadCount = await prisma.notification.count({
            where: { userId, read: false },
          });

          send("heartbeat", { unreadCount });
        } catch (error) {
          console.error("SSE heartbeat error:", error);
          send("heartbeat", {});
        }
      }

      function cleanup() {
        closed = true;
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        if (pollTimer) clearInterval(pollTimer);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      }

      // Send initial connection event
      send("connected", {
        userId,
        timestamp: lastCheckedAt.toISOString(),
      });

      // Poll for new notifications every 5 seconds
      pollTimer = setInterval(poll, POLL_INTERVAL_MS);

      // Send heartbeat with unread count every 15 seconds
      heartbeatTimer = setInterval(sendHeartbeatWithCount, HEARTBEAT_INTERVAL_MS);

      // Clean up when the client disconnects
      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
