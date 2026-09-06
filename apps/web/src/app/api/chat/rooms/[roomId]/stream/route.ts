import { NextRequest } from "next/server";
import { prisma } from "@familysync/database";

type RouteParams = { params: Promise<{ roomId: string }> };

// GET /api/chat/rooms/:roomId/stream?userId=X — SSE stream for new chat messages
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { roomId } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "userId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Verify the room exists
  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    select: { id: true, familyId: true },
  });

  if (!room) {
    return new Response(JSON.stringify({ error: "Chat room not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Verify the user is a member of the family that owns this room
  const membership = await prisma.familyMember.findUnique({
    where: { familyId_userId: { familyId: room.familyId, userId } },
  });

  if (!membership) {
    return new Response(
      JSON.stringify({ error: "You are not a member of this family" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const POLL_INTERVAL_MS = 3_000;
  const HEARTBEAT_INTERVAL_MS = 15_000;

  const stream = new ReadableStream({
    start(controller) {
      let lastSeenTimestamp = new Date();
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
          const messages = await prisma.chatMessage.findMany({
            where: {
              chatRoomId: roomId,
              createdAt: { gt: lastSeenTimestamp },
            },
            include: {
              sender: {
                select: { id: true, name: true, avatarUrl: true },
              },
            },
            orderBy: { createdAt: "asc" },
          });

          for (const message of messages) {
            send("message", message);
          }

          if (messages.length > 0) {
            lastSeenTimestamp = messages[messages.length - 1].createdAt;
          }
        } catch (error) {
          console.error("SSE chat poll error:", error);
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
      send("connected", { roomId, timestamp: lastSeenTimestamp.toISOString() });

      // Poll for new messages every 3 seconds
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
