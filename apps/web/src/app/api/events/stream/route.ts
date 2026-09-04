import { NextRequest } from "next/server";
import { prisma } from "@familysync/database";

// GET /api/events/stream?familyId=X&userId=Y — SSE stream for event and notification updates
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const familyIdParam = searchParams.get("familyId");
  const userIdParam = searchParams.get("userId");

  if (!familyIdParam) {
    return new Response(JSON.stringify({ error: "familyId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!userIdParam) {
    return new Response(JSON.stringify({ error: "userId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const familyId = familyIdParam;
  const userId = userIdParam;

  // Verify the user is a member of this family
  const membership = await prisma.familyMember.findUnique({
    where: { familyId_userId: { familyId: familyId, userId } },
  });

  if (!membership) {
    return new Response(
      JSON.stringify({ error: "You are not a member of this family" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
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
          // Check for events updated since last check
          const updatedEvents = await prisma.event.findMany({
            where: {
              familyId,
              updatedAt: { gt: lastCheckedAt },
            },
            include: {
              attendees: {
                include: {
                  user: {
                    select: { id: true, name: true, avatarUrl: true },
                  },
                },
              },
              creator: {
                select: { id: true, name: true, avatarUrl: true },
              },
            },
            orderBy: { updatedAt: "asc" },
          });

          for (const event of updatedEvents) {
            send("event_update", event);
          }

          // Check for new notifications for this user
          const newNotifications = await prisma.notification.findMany({
            where: {
              userId,
              createdAt: { gt: lastCheckedAt },
            },
            orderBy: { createdAt: "asc" },
          });

          for (const notification of newNotifications) {
            send("notification", notification);
          }

          lastCheckedAt = new Date();
        } catch (error) {
          console.error("SSE events poll error:", error);
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
        familyId,
        userId,
        timestamp: lastCheckedAt.toISOString(),
      });

      // Poll for updates every 5 seconds
      pollTimer = setInterval(poll, POLL_INTERVAL_MS);

      // Send heartbeat every 15 seconds
      heartbeatTimer = setInterval(() => {
        send("heartbeat", {});
      }, HEARTBEAT_INTERVAL_MS);

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
