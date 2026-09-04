import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, familyColors } from "../../src/theme/colors";
import { useAuthStore } from "../../src/store/authStore";
import { useFamilyStore } from "../../src/store/familyStore";
import { eventAPI } from "../../src/lib/api";
import { LoadingSkeleton } from "../../src/components/LoadingSkeleton";
import { RetryView } from "../../src/components/RetryView";
import type { CalendarEvent, EventAttendeeInfo, EventCategory } from "@familysync/shared";

// Category display config
const CATEGORY_CONFIG: Record<
  EventCategory,
  { label: string; emoji: string; color: string }
> = {
  GENERAL: { label: "General", emoji: "📅", color: "#6366F1" },
  FAMILY_TIME: { label: "Family Time", emoji: "🏠", color: "#FF6B6B" },
  OUTDOOR: { label: "Outdoor", emoji: "🌿", color: "#10B981" },
  DINING: { label: "Dining Out", emoji: "🍕", color: "#F59E0B" },
  MOVIE_NIGHT: { label: "Movie Night", emoji: "🎬", color: "#8B5CF6" },
  GAME_NIGHT: { label: "Game Night", emoji: "🎲", color: "#06B6D4" },
  ADVENTURE: { label: "Adventure", emoji: "🏔️", color: "#059669" },
  SPORTS: { label: "Sports", emoji: "⚽", color: "#EA580C" },
  CRAFTS: { label: "Crafts", emoji: "🎨", color: "#EC4899" },
  HOLIDAY: { label: "Holiday", emoji: "🎁", color: "#DC2626" },
  BIRTHDAY: { label: "Birthday", emoji: "🎂", color: "#D946EF" },
  TRAVEL: { label: "Travel", emoji: "✈️", color: "#0284C7" },
  APPOINTMENT: { label: "Appointment", emoji: "⏰", color: "#78716C" },
};

const RSVP_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  ACCEPTED: { label: "Going", color: "#059669", bg: "#ECFDF5" },
  DECLINED: { label: "Not Going", color: "#DC2626", bg: "#FEF2F2" },
  MAYBE: { label: "Maybe", color: "#D97706", bg: "#FFFBEB" },
  PENDING: { label: "Pending", color: "#78716C", bg: "#F5F5F4" },
};

// Mock event data for when the API is not yet connected
function getMockEvent(id: string): CalendarEvent {
  const mockEvents: Record<string, CalendarEvent> = {
    "1": {
      id: "1",
      familyId: "fam1",
      title: "Family Hike",
      description:
        "Morning hike along the Blue Ridge Trail. Bring water bottles, sunscreen, and snacks. Dogs welcome!",
      location: "Blue Ridge Trail",
      startTime: "2026-03-05T10:00:00.000Z",
      endTime: "2026-03-05T13:00:00.000Z",
      allDay: false,
      category: "OUTDOOR",
      cost: "$0",
      attendees: [
        { userId: "1", name: "Marcus", status: "ACCEPTED" },
        { userId: "2", name: "Sarah", status: "ACCEPTED" },
        { userId: "3", name: "Emma", status: "MAYBE" },
        { userId: "4", name: "Jake", status: "PENDING" },
      ],
    },
    "2": {
      id: "2",
      familyId: "fam1",
      title: "Game Night",
      description: "Board games and card games for the whole family. Snacks provided!",
      location: "Home",
      startTime: "2026-03-12T19:00:00.000Z",
      endTime: "2026-03-12T22:00:00.000Z",
      allDay: false,
      category: "GAME_NIGHT",
      attendees: [
        { userId: "1", name: "Marcus", status: "ACCEPTED" },
        { userId: "2", name: "Sarah", status: "ACCEPTED" },
        { userId: "3", name: "Emma", status: "ACCEPTED" },
        { userId: "4", name: "Jake", status: "ACCEPTED" },
      ],
    },
    "3": {
      id: "3",
      familyId: "fam1",
      title: "Italian Dinner",
      description: "Celebrating the end of the school term with a nice dinner out.",
      location: "Olive Garden",
      startTime: "2026-03-15T18:30:00.000Z",
      endTime: "2026-03-15T20:30:00.000Z",
      allDay: false,
      category: "DINING",
      cost: "$85",
      attendees: [
        { userId: "1", name: "Marcus", status: "ACCEPTED" },
        { userId: "2", name: "Sarah", status: "ACCEPTED" },
        { userId: "3", name: "Emma", status: "DECLINED" },
        { userId: "4", name: "Jake", status: "MAYBE" },
      ],
    },
    "4": {
      id: "4",
      familyId: "fam1",
      title: "Movie Night",
      description: "Family movie marathon! Popcorn and blankets ready.",
      location: "Home",
      startTime: "2026-03-20T20:00:00.000Z",
      endTime: "2026-03-20T23:00:00.000Z",
      allDay: false,
      category: "MOVIE_NIGHT",
      attendees: [
        { userId: "1", name: "Marcus", status: "ACCEPTED" },
        { userId: "2", name: "Sarah", status: "PENDING" },
        { userId: "3", name: "Emma", status: "ACCEPTED" },
        { userId: "4", name: "Jake", status: "ACCEPTED" },
      ],
    },
  };
  return (
    mockEvents[id] || {
      id,
      familyId: "fam1",
      title: "Event",
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false,
      category: "GENERAL",
      attendees: [],
    }
  );
}

function formatDisplayDate(isoString: string, allDay: boolean): string {
  const d = new Date(isoString);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = days[d.getDay()];
  const month = months[d.getMonth()];
  const date = d.getDate();
  const year = d.getFullYear();

  if (allDay) {
    return `${dayName}, ${month} ${date}, ${year}`;
  }
  const hours = d.getHours();
  const mins = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${dayName}, ${month} ${date}, ${year} at ${h}:${mins} ${ampm}`;
}

function formatTimeRange(start: string, end: string, allDay: boolean): string {
  if (allDay) return "All Day";
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) => {
    const hours = d.getHours();
    const mins = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const h = hours % 12 || 12;
    return `${h}:${mins} ${ampm}`;
  };
  return `${fmt(s)} - ${fmt(e)}`;
}

function getAttendeeColor(index: number): string {
  return familyColors[index % familyColors.length];
}

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const removeEvent = useFamilyStore((s) => s.removeEvent);

  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  async function loadEvent() {
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await eventAPI.get(id!);
      const data: CalendarEvent = response.data.event ?? response.data;
      setEvent(data);
    } catch {
      // Fall back to mock data when API is not available
      const mock = getMockEvent(id!);
      if (mock.title === "Event" && mock.attendees.length === 0) {
        // Generic fallback means event was truly not found
        setLoadError("Failed to load event details.");
      } else {
        setEvent(mock);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRSVP(status: "ACCEPTED" | "DECLINED" | "MAYBE") {
    if (!event || !user) return;
    setRsvpLoading(true);
    try {
      await eventAPI.rsvp(event.id, { userId: user.id, status });
      // Optimistically update the attendee status locally
      setEvent((prev: CalendarEvent | null) => {
        if (!prev) return prev;
        const updatedAttendees = prev.attendees.map((a: EventAttendeeInfo) =>
          a.userId === user.id ? { ...a, status } : a
        );
        // If user is not in attendees list, add them
        const isInList = prev.attendees.some(
          (a: EventAttendeeInfo) => a.userId === user.id
        );
        if (!isInList) {
          updatedAttendees.push({
            userId: user.id,
            name: user.name,
            status,
          });
        }
        return { ...prev, attendees: updatedAttendees };
      });
    } catch {
      // Optimistic update even if API fails (for demo/mock mode)
      setEvent((prev: CalendarEvent | null) => {
        if (!prev) return prev;
        const updatedAttendees = prev.attendees.map(
          (a: EventAttendeeInfo) =>
            a.userId === user!.id ? { ...a, status } : a
        );
        return { ...prev, attendees: updatedAttendees };
      });
    } finally {
      setRsvpLoading(false);
    }
  }

  function handleDelete() {
    if (!event) return;
    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete "${event.title}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await eventAPI.delete(event.id);
              removeEvent(event.id);
            } catch {
              // Remove from local state even if API fails (mock mode)
              removeEvent(event.id);
            }
            router.back();
          },
        },
      ]
    );
  }

  // Determine if the current user is the event creator.
  // In a real app this would come from the event data; for now treat user "1" as creator.
  const isCreator =
    user?.id === "1" || (event?.attendees?.[0]?.userId === user?.id);

  // Find the current user's RSVP status
  const myRsvp = event?.attendees?.find(
    (a: EventAttendeeInfo) => a.userId === user?.id
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSkeleton variant="card" count={2} />
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.loadingContainer}>
        <RetryView
          message={loadError}
          onRetry={loadEvent}
        />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorMessage}>Event not found</Text>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => router.back()}
        >
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const catConfig = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.GENERAL;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>{"<"}</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
        {isCreator && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => Alert.alert("Edit", "Edit functionality coming soon!")}
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category Badge + Title */}
        <View style={styles.titleSection}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: catConfig.color + "18" },
            ]}
          >
            <Text style={styles.categoryEmoji}>{catConfig.emoji}</Text>
            <Text style={[styles.categoryText, { color: catConfig.color }]}>
              {catConfig.label}
            </Text>
          </View>
          <Text style={styles.eventTitle}>{event.title}</Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          {/* Date & Time */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailIconText}>🕐</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>
                {formatDisplayDate(event.startTime, event.allDay)}
              </Text>
              <Text style={styles.detailSubvalue}>
                {formatTimeRange(event.startTime, event.endTime, event.allDay)}
              </Text>
            </View>
          </View>

          {/* Location */}
          {event.location ? (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailIconText}>📍</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{event.location}</Text>
              </View>
            </View>
          ) : null}

          {/* Cost */}
          {event.cost ? (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailIconText}>💰</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Estimated Cost</Text>
                <Text style={styles.detailValue}>{event.cost}</Text>
              </View>
            </View>
          ) : null}

          {/* Description */}
          {event.description ? (
            <View style={[styles.detailRow, styles.detailRowLast]}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailIconText}>📝</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.descriptionText}>{event.description}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Attendees */}
        <View style={styles.attendeesSection}>
          <Text style={styles.sectionTitle}>
            Attendees ({event.attendees.length})
          </Text>
          <View style={styles.attendeesList}>
            {event.attendees.map((attendee, index) => {
              const rsvpInfo =
                RSVP_CONFIG[attendee.status] || RSVP_CONFIG.PENDING;
              return (
                <View key={attendee.userId} style={styles.attendeeRow}>
                  <View
                    style={[
                      styles.attendeeAvatar,
                      { backgroundColor: getAttendeeColor(index) },
                    ]}
                  >
                    <Text style={styles.attendeeInitial}>
                      {attendee.name[0]}
                    </Text>
                  </View>
                  <Text style={styles.attendeeName}>{attendee.name}</Text>
                  <View
                    style={[
                      styles.rsvpBadge,
                      { backgroundColor: rsvpInfo.bg },
                    ]}
                  >
                    <Text
                      style={[styles.rsvpBadgeText, { color: rsvpInfo.color }]}
                    >
                      {rsvpInfo.label}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* RSVP Actions */}
        <View style={styles.rsvpSection}>
          <Text style={styles.sectionTitle}>Your RSVP</Text>
          {myRsvp && myRsvp.status !== "PENDING" ? (
            <Text style={styles.currentRsvp}>
              You responded:{" "}
              <Text style={{ fontWeight: "800" }}>
                {RSVP_CONFIG[myRsvp.status]?.label || myRsvp.status}
              </Text>
            </Text>
          ) : null}
          <View style={styles.rsvpButtons}>
            <TouchableOpacity
              style={[
                styles.rsvpButton,
                styles.rsvpAccept,
                myRsvp?.status === "ACCEPTED" && styles.rsvpActive,
              ]}
              onPress={() => handleRSVP("ACCEPTED")}
              disabled={rsvpLoading}
            >
              <Text
                style={[
                  styles.rsvpButtonText,
                  styles.rsvpAcceptText,
                  myRsvp?.status === "ACCEPTED" && styles.rsvpActiveText,
                ]}
              >
                Accept
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.rsvpButton,
                styles.rsvpMaybe,
                myRsvp?.status === "MAYBE" && styles.rsvpMaybeActive,
              ]}
              onPress={() => handleRSVP("MAYBE")}
              disabled={rsvpLoading}
            >
              <Text
                style={[
                  styles.rsvpButtonText,
                  styles.rsvpMaybeText,
                  myRsvp?.status === "MAYBE" && styles.rsvpMaybeActiveText,
                ]}
              >
                Maybe
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.rsvpButton,
                styles.rsvpDecline,
                myRsvp?.status === "DECLINED" && styles.rsvpDeclineActive,
              ]}
              onPress={() => handleRSVP("DECLINED")}
              disabled={rsvpLoading}
            >
              <Text
                style={[
                  styles.rsvpButtonText,
                  styles.rsvpDeclineText,
                  myRsvp?.status === "DECLINED" && styles.rsvpDeclineActiveText,
                ]}
              >
                Decline
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: colors.neutral[500],
    marginBottom: 16,
  },
  goBackButton: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  goBackText: {
    color: colors.primary[600],
    fontWeight: "700",
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backArrow: {
    fontSize: 20,
    color: colors.primary[500],
    fontWeight: "700",
  },
  backLabel: {
    fontSize: 16,
    color: colors.primary[500],
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.primary[50],
  },
  editText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary[600],
  },
  deleteButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.coral[50],
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.coral[500],
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "700",
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.neutral[900],
    lineHeight: 34,
  },
  detailsCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  detailRowLast: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.neutral[50],
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  detailIconText: {
    fontSize: 18,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.neutral[400],
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.neutral[800],
  },
  detailSubvalue: {
    fontSize: 13,
    color: colors.neutral[500],
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.neutral[600],
    lineHeight: 22,
  },
  attendeesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.neutral[800],
    marginBottom: 12,
  },
  attendeesList: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  attendeeRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  attendeeAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  attendeeInitial: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  attendeeName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.neutral[800],
    marginLeft: 12,
  },
  rsvpBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rsvpBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  rsvpSection: {
    marginBottom: 16,
  },
  currentRsvp: {
    fontSize: 14,
    color: colors.neutral[500],
    marginBottom: 12,
  },
  rsvpButtons: {
    flexDirection: "row",
    gap: 10,
  },
  rsvpButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
  },
  rsvpButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  rsvpAccept: {
    borderColor: colors.success[500],
    backgroundColor: "white",
  },
  rsvpAcceptText: {
    color: colors.success[500],
  },
  rsvpActive: {
    backgroundColor: colors.success[500],
    borderColor: colors.success[500],
  },
  rsvpActiveText: {
    color: "white",
  },
  rsvpMaybe: {
    borderColor: colors.amber[500],
    backgroundColor: "white",
  },
  rsvpMaybeText: {
    color: colors.amber[500],
  },
  rsvpMaybeActive: {
    backgroundColor: colors.amber[500],
    borderColor: colors.amber[500],
  },
  rsvpMaybeActiveText: {
    color: "white",
  },
  rsvpDecline: {
    borderColor: colors.coral[500],
    backgroundColor: "white",
  },
  rsvpDeclineText: {
    color: colors.coral[500],
  },
  rsvpDeclineActive: {
    backgroundColor: colors.coral[500],
    borderColor: colors.coral[500],
  },
  rsvpDeclineActiveText: {
    color: "white",
  },
});
