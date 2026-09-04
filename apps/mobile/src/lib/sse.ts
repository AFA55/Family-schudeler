// ============================================
// Lightweight SSE Client for React Native
// ============================================
//
// React Native does not include a native EventSource API.
// This module uses fetch with streaming to parse SSE frames
// and provides auto-reconnect with exponential backoff.

const INITIAL_BACKOFF_MS = 2_000;
const MAX_BACKOFF_MS = 30_000;

export interface SSEHandlers {
  /** Called when a data event (e.g. "message", "event_update", "notification") arrives. */
  onMessage?: (event: string, data: unknown) => void;
  /** Called when a heartbeat event arrives. */
  onHeartbeat?: (data: unknown) => void;
  /** Called on connection errors. */
  onError?: (error: Error) => void;
  /** Called when the connection is established. */
  onConnected?: (data: unknown) => void;
}

export interface SSEConnection {
  /** Close the connection and stop reconnecting. */
  close(): void;
}

/**
 * Create an SSE connection to the given URL.
 *
 * Usage:
 * ```ts
 * import { createSSEConnection } from "@/lib/sse";
 *
 * const conn = createSSEConnection(
 *   "https://api.example.com/events/stream?familyId=abc&userId=123",
 *   {
 *     onMessage: (event, data) => console.log(event, data),
 *     onHeartbeat: (data) => console.log("heartbeat", data),
 *     onError: (err) => console.warn("SSE error:", err),
 *   }
 * );
 *
 * // Later, to disconnect:
 * conn.close();
 * ```
 */
export function createSSEConnection(
  url: string,
  handlers: SSEHandlers
): SSEConnection {
  let abortController: AbortController | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let backoffMs = INITIAL_BACKOFF_MS;
  let closed = false;

  async function connect() {
    if (closed) return;

    abortController = new AbortController();

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
        },
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`SSE connection failed: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("SSE response has no body");
      }

      // Reset backoff on successful connection
      backoffMs = INITIAL_BACKOFF_MS;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (!closed) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE frames are separated by double newlines
        const frames = buffer.split("\n\n");
        // Keep the last incomplete frame in the buffer
        buffer = frames.pop() || "";

        for (const frame of frames) {
          if (!frame.trim()) continue;
          processFrame(frame);
        }
      }
    } catch (error) {
      if (closed) return;

      // AbortError is expected when we call close()
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      const err =
        error instanceof Error ? error : new Error(String(error));
      handlers.onError?.(err);
    }

    // Reconnect if not intentionally closed
    if (!closed) {
      scheduleReconnect();
    }
  }

  function processFrame(frame: string) {
    const lines = frame.split("\n");
    let eventType = "message";
    let dataLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith("event: ")) {
        eventType = line.slice(7).trim();
      } else if (line.startsWith("data: ")) {
        dataLines.push(line.slice(6));
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice(5));
      }
    }

    if (dataLines.length === 0) return;

    const rawData = dataLines.join("\n");
    let parsedData: unknown;

    try {
      parsedData = JSON.parse(rawData);
    } catch {
      parsedData = rawData;
    }

    switch (eventType) {
      case "heartbeat":
        handlers.onHeartbeat?.(parsedData);
        break;
      case "connected":
        handlers.onConnected?.(parsedData);
        break;
      default:
        handlers.onMessage?.(eventType, parsedData);
        break;
    }
  }

  function scheduleReconnect() {
    if (closed) return;

    if (__DEV__) {
      console.log(`[SSE] Reconnecting in ${backoffMs}ms...`);
    }

    reconnectTimer = setTimeout(() => {
      backoffMs = Math.min(backoffMs * 2, MAX_BACKOFF_MS);
      connect();
    }, backoffMs);
  }

  function close() {
    closed = true;

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  }

  // Start the connection
  connect();

  return { close };
}
