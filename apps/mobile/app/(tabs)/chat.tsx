import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { colors } from "../../src/theme/colors";
import { useAuthStore } from "../../src/store/authStore";
import { useFamilyStore } from "../../src/store/familyStore";
import { chatAPI } from "../../src/lib/api";
import { LoadingSkeleton } from "../../src/components/LoadingSkeleton";
import { RetryView } from "../../src/components/RetryView";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Sender {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface AIRecommendation {
  title: string;
  description: string;
  location: string;
  cost: string;
  url?: string;
}

interface SuggestedEvent {
  title: string;
  startTime: string;
  endTime: string;
  location: string;
}

interface MessageMetadata {
  recommendations?: AIRecommendation[] | null;
  suggestedEvent?: SuggestedEvent | null;
}

interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  isAI: boolean;
  metadata?: MessageMetadata | null;
  createdAt: string;
  sender: Sender;
}

interface ChatRoom {
  id: string;
  familyId: string;
  name: string | null;
  createdAt: string;
  family: { id: string; name: string; color: string };
  lastMessage: ChatMessage | null;
  messageCount: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function getInitial(name: string): string {
  return (name || "?").charAt(0).toUpperCase();
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RecommendationCard({ rec }: { rec: AIRecommendation }) {
  const handlePress = () => {
    if (rec.url) {
      Linking.openURL(rec.url).catch(() => {});
    }
  };

  return (
    <TouchableOpacity
      style={styles.recCard}
      onPress={handlePress}
      activeOpacity={rec.url ? 0.7 : 1}
      disabled={!rec.url}
    >
      <Text style={styles.recTitle}>{rec.title}</Text>
      <Text style={styles.recDescription} numberOfLines={2}>
        {rec.description}
      </Text>
      <View style={styles.recMeta}>
        <Text style={styles.recMetaText}>{rec.location}</Text>
        <Text style={styles.recCost}>{rec.cost}</Text>
      </View>
      {rec.url && <Text style={styles.recLink}>Tap to learn more</Text>}
    </TouchableOpacity>
  );
}

function SuggestedEventCard({ event }: { event: SuggestedEvent }) {
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);
  const dateStr = start.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;

  return (
    <View style={styles.suggestedEvent}>
      <View style={styles.suggestedEventBadge}>
        <Text style={styles.suggestedEventBadgeText}>Suggested Event</Text>
      </View>
      <Text style={styles.suggestedEventTitle}>{event.title}</Text>
      <Text style={styles.suggestedEventDetail}>{dateStr} {timeStr}</Text>
      <Text style={styles.suggestedEventDetail}>{event.location}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function ChatScreen() {
  const { user } = useAuthStore();
  const { activeFamily } = useFamilyStore();

  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  // ------ Initialize room ------

  useEffect(() => {
    if (user?.id && activeFamily?.id) {
      initializeRoom();
    }
  }, [user?.id, activeFamily?.id]);

  const initializeRoom = async () => {
    if (!user?.id || !activeFamily?.id) return;
    setIsLoading(true);
    setError(null);

    try {
      const roomsRes = await chatAPI.getRooms(user.id);
      const rooms: ChatRoom[] = roomsRes.data.rooms ?? [];
      const familyRoom = rooms.find((r) => r.familyId === activeFamily.id);

      if (familyRoom) {
        setRoom(familyRoom);
        await fetchMessages(familyRoom.id);
      } else {
        const createRes = await chatAPI.createRoom(
          activeFamily.id,
          user.id,
          "Family Chat"
        );
        const newRoom: ChatRoom = createRes.data.room;
        setRoom(newRoom);
        setMessages([]);
      }
    } catch {
      setError("Failed to load chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ------ Messages ------

  const fetchMessages = async (roomId: string, cursor?: string) => {
    if (!user?.id) return;
    try {
      const res = await chatAPI.getMessages(roomId, user.id, cursor);
      const {
        messages: fetched,
        nextCursor: nc,
        hasMore: hm,
      } = res.data;

      if (cursor) {
        // Append older messages (at the end because list is inverted)
        setMessages((prev) => [...prev, ...fetched]);
      } else {
        setMessages(fetched);
      }
      setNextCursor(nc ?? null);
      setHasMore(!!hm);
    } catch {
      if (!cursor) setError("Failed to load messages.");
    }
  };

  const handleRefresh = useCallback(async () => {
    if (!room?.id) return;
    setIsRefreshing(true);
    await fetchMessages(room.id);
    setIsRefreshing(false);
  }, [room?.id, user?.id]);

  const handleLoadMore = useCallback(async () => {
    if (!room?.id || !hasMore || isLoadingMore || !nextCursor) return;
    setIsLoadingMore(true);
    await fetchMessages(room.id, nextCursor);
    setIsLoadingMore(false);
  }, [room?.id, hasMore, isLoadingMore, nextCursor, user?.id]);

  // ------ Sending ------

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !room?.id || !user?.id || !activeFamily?.id || isSending)
      return;

    setInputText("");
    setIsSending(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      chatRoomId: room.id,
      senderId: user.id,
      content: text,
      isAI: false,
      createdAt: new Date().toISOString(),
      sender: { id: user.id, name: user.name, avatarUrl: user.avatarUrl },
    };

    // Show the user's message immediately
    setMessages((prev) => [optimisticMsg, ...prev]);

    if (isAIMode) {
      try {
        // The AI endpoint saves both user + AI messages to the room
        await chatAPI.askAI(text, activeFamily.id, user.id, room.id);
        // Refetch to get the server-persisted messages (including AI reply)
        await fetchMessages(room.id);
      } catch {
        Alert.alert("Error", "Failed to get AI response. Please try again.");
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
      setIsAIMode(false);
    } else {
      try {
        const res = await chatAPI.sendMessage(room.id, user.id, text);
        const realMsg: ChatMessage = res.data.message;
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? realMsg : m))
        );
      } catch {
        Alert.alert("Error", "Failed to send message. Please try again.");
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    }

    setIsSending(false);
  };

  // ------ Render helpers ------

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isMe = item.senderId === user?.id && !item.isAI;
      const isAI = item.isAI;
      const metadata = item.metadata as MessageMetadata | null | undefined;
      const recommendations = metadata?.recommendations;
      const suggestedEvent = metadata?.suggestedEvent;

      return (
        <View
          style={[
            styles.messageBubbleRow,
            isMe ? styles.messageBubbleRowRight : styles.messageBubbleRowLeft,
          ]}
        >
          {/* Avatar for non-self messages */}
          {!isMe && (
            <View
              style={[
                styles.avatar,
                isAI ? styles.avatarAI : styles.avatarOther,
              ]}
            >
              <Text style={styles.avatarText}>
                {isAI ? "AI" : getInitial(item.sender?.name ?? "?")}
              </Text>
            </View>
          )}

          <View style={styles.messageBubbleContent}>
            {/* Sender name for non-self messages */}
            {!isMe && (
              <View style={styles.senderRow}>
                <Text style={styles.senderName}>
                  {isAI ? "FamilySync AI" : item.sender?.name ?? "Unknown"}
                </Text>
                {isAI && (
                  <View style={styles.aiBadge}>
                    <Text style={styles.aiBadgeText}>AI</Text>
                  </View>
                )}
              </View>
            )}

            <View
              style={[
                styles.bubble,
                isMe
                  ? styles.bubbleMe
                  : isAI
                  ? styles.bubbleAI
                  : styles.bubbleOther,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  isMe ? styles.bubbleTextMe : styles.bubbleTextOther,
                ]}
              >
                {item.content}
              </Text>
            </View>

            {/* AI recommendation cards */}
            {isAI && recommendations && recommendations.length > 0 && (
              <View style={styles.recContainer}>
                {recommendations.map((rec, idx) => (
                  <RecommendationCard key={idx} rec={rec} />
                ))}
              </View>
            )}

            {/* Suggested event */}
            {isAI && suggestedEvent && (
              <SuggestedEventCard event={suggestedEvent} />
            )}

            <Text
              style={[
                styles.timestamp,
                isMe ? styles.timestampRight : styles.timestampLeft,
              ]}
            >
              {formatTime(item.createdAt)}
            </Text>
          </View>
        </View>
      );
    },
    [user?.id]
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={colors.primary[400]} />
      </View>
    );
  };

  // ------ No auth / no family states ------

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Family Chat</Text>
        </View>
        <View style={styles.centeredContainer}>
          <Text style={styles.centeredText}>
            Please sign in to use the chat.
          </Text>
        </View>
      </View>
    );
  }

  if (!activeFamily) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Family Chat</Text>
        </View>
        <View style={styles.centeredContainer}>
          <Text style={styles.centeredText}>
            Join or create a family to start chatting.
          </Text>
        </View>
      </View>
    );
  }

  // ------ Loading state ------

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {room?.name ?? activeFamily.name ?? "Family Chat"}
          </Text>
        </View>
        <LoadingSkeleton variant="list" count={6} />
      </View>
    );
  }

  // ------ Error state ------

  if (error && !room) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Family Chat</Text>
        </View>
        <RetryView
          message={error}
          onRetry={initializeRoom}
        />
      </View>
    );
  }

  // ------ Main chat UI ------

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {room?.name ?? activeFamily.name ?? "Family Chat"}
        </Text>
        <Text style={styles.headerSubtitle}>{activeFamily.name}</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={styles.messagesList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>👋</Text>
            <Text style={styles.emptyTitle}>Welcome to Family Chat!</Text>
            <Text style={styles.emptyText}>
              Send a message or tap the sparkle button to ask the AI planning
              assistant for activity ideas.
            </Text>
          </View>
        }
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />

      {/* Input bar */}
      <View style={styles.inputBar}>
        {/* AI mode toggle */}
        <TouchableOpacity
          style={[styles.aiButton, isAIMode && styles.aiButtonActive]}
          onPress={() => setIsAIMode(!isAIMode)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.aiButtonIcon,
              isAIMode && styles.aiButtonIconActive,
            ]}
          >
            ✦
          </Text>
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder={
              isAIMode
                ? "Ask AI for activity ideas..."
                : "Type a message..."
            }
            placeholderTextColor={colors.neutral[400]}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={2000}
            editable={!isSending}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isSending) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isSending}
          activeOpacity={0.7}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.sendButtonIcon}>↑</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* AI mode indicator */}
      {isAIMode && (
        <View style={styles.aiModeBar}>
          <Text style={styles.aiModeText}>
            ✦ AI Mode — Your message will be sent to the planning assistant
          </Text>
          <TouchableOpacity onPress={() => setIsAIMode(false)}>
            <Text style={styles.aiModeDismiss}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.neutral[900],
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.neutral[400],
    marginTop: 2,
  },

  // Centered states (loading, error, empty auth/family)
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  centeredText: {
    fontSize: 15,
    color: colors.neutral[400],
    textAlign: "center",
    lineHeight: 22,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: colors.neutral[400],
  },
  errorEmoji: {
    fontSize: 40,
    fontWeight: "700",
    color: colors.coral[500],
    marginBottom: 12,
    width: 56,
    height: 56,
    lineHeight: 56,
    textAlign: "center",
    borderRadius: 28,
    backgroundColor: colors.coral[50],
    overflow: "hidden",
  },
  errorText: {
    fontSize: 15,
    color: colors.neutral[500],
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },

  // Empty state (inverted, so this renders "upside-down" visually — we flip it)
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
    transform: [{ scaleY: -1 }], // un-invert so text reads normally
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.neutral[800],
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: colors.neutral[400],
    textAlign: "center",
    lineHeight: 21,
  },

  // Messages list
  messagesList: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  // Message bubble row
  messageBubbleRow: {
    flexDirection: "row",
    marginBottom: 12,
    maxWidth: "85%",
  },
  messageBubbleRowRight: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  messageBubbleRowLeft: {
    alignSelf: "flex-start",
  },

  // Avatar
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18, // align with bubble top (below sender name)
  },
  avatarOther: {
    backgroundColor: colors.neutral[200],
    marginRight: 8,
  },
  avatarAI: {
    backgroundColor: colors.amber[100],
    marginRight: 8,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.neutral[700],
  },

  // Sender name
  senderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.neutral[500],
  },

  // AI badge
  aiBadge: {
    backgroundColor: colors.amber[100],
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 6,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.amber[600],
  },

  // Bubble
  messageBubbleContent: {
    flexShrink: 1,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMe: {
    backgroundColor: colors.primary[500],
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.neutral[100],
    borderBottomLeftRadius: 4,
  },
  bubbleAI: {
    backgroundColor: colors.amber[50],
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.amber[300],
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
  },
  bubbleTextMe: {
    color: "white",
  },
  bubbleTextOther: {
    color: colors.neutral[800],
  },

  // Timestamp
  timestamp: {
    fontSize: 11,
    color: colors.neutral[400],
    marginTop: 3,
  },
  timestampRight: {
    textAlign: "right",
  },
  timestampLeft: {
    textAlign: "left",
  },

  // Recommendation cards
  recContainer: {
    marginTop: 8,
    gap: 8,
  },
  recCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  recTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.neutral[800],
    marginBottom: 4,
  },
  recDescription: {
    fontSize: 13,
    color: colors.neutral[500],
    lineHeight: 18,
    marginBottom: 6,
  },
  recMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recMetaText: {
    fontSize: 12,
    color: colors.neutral[400],
  },
  recCost: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.success[600],
  },
  recLink: {
    fontSize: 12,
    color: colors.primary[500],
    fontWeight: "600",
    marginTop: 6,
  },

  // Suggested event card
  suggestedEvent: {
    marginTop: 8,
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  suggestedEventBadge: {
    backgroundColor: colors.primary[500],
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  suggestedEventBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "white",
  },
  suggestedEventTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.neutral[800],
    marginBottom: 4,
  },
  suggestedEventDetail: {
    fontSize: 12,
    color: colors.neutral[500],
    lineHeight: 18,
  },

  // Loading more
  loadingMoreContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },

  // Input bar
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
    backgroundColor: "white",
  },
  aiButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral[100],
    marginRight: 8,
    marginBottom: 2,
  },
  aiButtonActive: {
    backgroundColor: colors.amber[500],
  },
  aiButtonIcon: {
    fontSize: 18,
    color: colors.neutral[400],
  },
  aiButtonIconActive: {
    color: "white",
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.neutral[50],
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 8 : 4,
    maxHeight: 100,
    justifyContent: "center",
  },
  textInput: {
    fontSize: 15,
    color: colors.neutral[800],
    maxHeight: 80,
    lineHeight: 20,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral[200],
  },
  sendButtonIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },

  // AI mode indicator bar
  aiModeBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.amber[50],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.amber[300],
  },
  aiModeText: {
    fontSize: 12,
    color: colors.amber[600],
    fontWeight: "600",
    flex: 1,
  },
  aiModeDismiss: {
    fontSize: 13,
    color: colors.coral[500],
    fontWeight: "700",
    marginLeft: 12,
  },
});
