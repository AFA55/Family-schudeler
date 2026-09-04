import { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { colors, familyColors } from "../../src/theme/colors";
import { useFamilyStore } from "../../src/store/familyStore";
import { useAuthStore } from "../../src/store/authStore";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CATEGORY_EMOJI: Record<string, string> = {
  OUTDOOR: "🌿",
  GAME_NIGHT: "🎲",
  DINING: "🍝",
  MOVIE_NIGHT: "🎬",
  FAMILY_TIME: "👨‍👩‍👧‍👦",
  ADVENTURE: "🥾",
  SPORTS: "⚽",
  CRAFTS: "🎨",
  HOLIDAY: "🎉",
  BIRTHDAY: "🎂",
  TRAVEL: "✈️",
  APPOINTMENT: "📋",
  GENERAL: "📅",
};

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function CalendarScreen() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState(now.getDate());
  const todayDay = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  const { events, isLoading, activeFamily, fetchEvents, fetchFamilies } =
    useFamilyStore();
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Fetch families on mount if needed, then fetch events for the month
  useEffect(() => {
    const load = async () => {
      setError(null);
      try {
        if (!activeFamily && user?.id) {
          await fetchFamilies(user.id);
        }
      } catch {
        setError("Failed to load family data.");
      }
    };
    load();
  }, [user?.id]);

  useEffect(() => {
    const load = async () => {
      if (!activeFamily?.id) return;
      setError(null);
      try {
        const start = new Date(currentYear, currentMonth, 1)
          .toISOString()
          .split("T")[0];
        const end = new Date(currentYear, currentMonth + 1, 0)
          .toISOString()
          .split("T")[0];
        await fetchEvents(activeFamily.id, start, end);
      } catch {
        setError("Failed to load events.");
      }
    };
    load();
  }, [activeFamily?.id, currentMonth, currentYear]);

  // Map store events by day of month
  const eventsByDay = useMemo(() => {
    const map: Record<number, typeof displayEvents> = {};
    const displayEvents = events.map((e, i) => {
      const startDate = new Date(e.startTime);
      return {
        id: e.id,
        title: e.title,
        time: formatTime(e.startTime),
        location: e.location ?? "",
        category: e.category,
        color: e.color ?? familyColors[i % familyColors.length],
        day: startDate.getDate(),
        month: startDate.getMonth(),
        year: startDate.getFullYear(),
      };
    });
    for (const ev of displayEvents) {
      if (ev.month === currentMonth && ev.year === currentYear) {
        if (!map[ev.day]) map[ev.day] = [];
        map[ev.day].push(ev);
      }
    }
    return map;
  }, [events, currentMonth, currentYear]);

  const getDaysInMonth = () => {
    const days: (number | null)[] = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    return days;
  };

  const getEventsForDay = (day: number) => eventsByDay[day] ?? [];
  const selectedEvents = getEventsForDay(selectedDate);

  const monthLabel = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "long", year: "numeric" }
  );
  const isToday = (day: number) =>
    day === todayDay && currentMonth === todayMonth && currentYear === todayYear;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.headerTitle}>{monthLabel}</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Event</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              if (activeFamily?.id) {
                const start = new Date(currentYear, currentMonth, 1)
                  .toISOString()
                  .split("T")[0];
                const end = new Date(currentYear, currentMonth + 1, 0)
                  .toISOString()
                  .split("T")[0];
                setError(null);
                fetchEvents(activeFamily.id, start, end).catch(() =>
                  setError("Failed to load events.")
                );
              }
            }}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Calendar Grid */}
        <View style={styles.calendarCard}>
          {/* Day headers */}
          <View style={styles.dayHeaders}>
            {DAYS.map((day) => (
              <Text key={day} style={styles.dayHeader}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar days */}
          <View style={styles.daysGrid}>
            {getDaysInMonth().map((day, i) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              const dayIsToday = day ? isToday(day) : false;
              const dayIsSelected = day === selectedDate;

              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.dayCell,
                    dayIsToday && styles.todayCell,
                    dayIsSelected && !dayIsToday && styles.selectedCell,
                  ]}
                  onPress={() => day && setSelectedDate(day)}
                  disabled={!day}
                >
                  <Text
                    style={[
                      styles.dayText,
                      dayIsToday && styles.todayText,
                      dayIsSelected && !dayIsToday && styles.selectedText,
                      !day && styles.emptyDay,
                    ]}
                  >
                    {day || ""}
                  </Text>
                  {dayEvents.length > 0 && (
                    <View style={styles.eventDots}>
                      {dayEvents.slice(0, 3).map((event, j) => (
                        <View
                          key={j}
                          style={[styles.eventDot, { backgroundColor: event.color }]}
                        />
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Loading indicator for events */}
        {isLoading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.primary[500]} />
            <Text style={styles.loadingText}>Loading events...</Text>
          </View>
        )}

        {/* Selected day events */}
        <View style={styles.eventsSection}>
          <Text style={styles.eventsSectionTitle}>
            {isToday(selectedDate)
              ? "Today's Schedule"
              : `${new Date(currentYear, currentMonth, selectedDate).toLocaleDateString("default", { month: "long", day: "numeric" })}`}
          </Text>

          {selectedEvents.length > 0 ? (
            selectedEvents.map((event) => (
              <TouchableOpacity key={event.id} style={styles.eventCard}>
                <View
                  style={[styles.eventAccent, { backgroundColor: event.color }]}
                />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDetail}>
                    {event.time}{event.location ? ` · ${event.location}` : ""}
                  </Text>
                </View>
                <View style={styles.eventCategory}>
                  <Text style={styles.eventCategoryText}>
                    {CATEGORY_EMOJI[event.category] ?? "📅"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noEvents}>
              <Text style={styles.noEventsEmoji}>📅</Text>
              <Text style={styles.noEventsText}>No events scheduled</Text>
              <TouchableOpacity style={styles.noEventsButton}>
                <Text style={styles.noEventsButtonText}>
                  Plan something fun
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Plan</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.quickActionsRow}>
              {[
                { emoji: "🎬", label: "Movie Night" },
                { emoji: "🎲", label: "Game Night" },
                { emoji: "🥾", label: "Hike" },
                { emoji: "🍕", label: "Dinner Out" },
                { emoji: "🎨", label: "Crafts" },
                { emoji: "⚽", label: "Sports" },
              ].map((action, i) => (
                <TouchableOpacity key={i} style={styles.quickActionButton}>
                  <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: colors.neutral[400],
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.neutral[900],
  },
  addButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  calendarCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  dayHeaders: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: colors.neutral[400],
    paddingVertical: 4,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  todayCell: {
    backgroundColor: colors.primary[500],
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedCell: {
    backgroundColor: colors.primary[50],
    borderWidth: 1.5,
    borderColor: colors.primary[200],
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.neutral[700],
  },
  todayText: {
    color: "white",
  },
  selectedText: {
    color: colors.primary[600],
  },
  emptyDay: {
    color: "transparent",
  },
  eventDots: {
    flexDirection: "row",
    gap: 2,
    marginTop: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  eventsSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  eventsSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.neutral[800],
    marginBottom: 12,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  eventAccent: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 14,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.neutral[800],
    marginBottom: 4,
  },
  eventDetail: {
    fontSize: 13,
    color: colors.neutral[400],
  },
  eventCategory: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.neutral[50],
    alignItems: "center",
    justifyContent: "center",
  },
  eventCategoryText: {
    fontSize: 20,
  },
  noEvents: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "white",
    borderRadius: 20,
  },
  noEventsEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  noEventsText: {
    fontSize: 15,
    color: colors.neutral[400],
    marginBottom: 12,
  },
  noEventsButton: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  noEventsButtonText: {
    color: colors.primary[600],
    fontWeight: "600",
    fontSize: 14,
  },
  quickActions: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.neutral[800],
    marginBottom: 12,
  },
  quickActionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  quickActionButton: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    width: 85,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  quickActionEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.neutral[600],
    textAlign: "center",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 15,
    color: colors.coral[500],
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    color: colors.primary[600],
    fontWeight: "600",
    fontSize: 14,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: colors.neutral[400],
  },
});
