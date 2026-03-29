import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { colors, familyColors } from "../../src/theme/colors";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Mock data
const mockEvents = [
  {
    id: "1",
    title: "Family Hike",
    time: "10:00 AM",
    location: "Blue Ridge Trail",
    category: "OUTDOOR",
    color: familyColors[0],
    day: 5,
  },
  {
    id: "2",
    title: "Game Night",
    time: "7:00 PM",
    location: "Home",
    category: "GAME_NIGHT",
    color: familyColors[3],
    day: 12,
  },
  {
    id: "3",
    title: "Italian Dinner",
    time: "6:30 PM",
    location: "Olive Garden",
    category: "DINING",
    color: familyColors[1],
    day: 15,
  },
  {
    id: "4",
    title: "Movie Night",
    time: "8:00 PM",
    location: "Home",
    category: "MOVIE_NIGHT",
    color: familyColors[4],
    day: 20,
  },
];

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(29);
  const today = 29; // March 29, 2026

  const getDaysInMonth = () => {
    const days = [];
    const firstDay = 0; // March 2026 starts on Sunday
    const totalDays = 31;

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    return days;
  };

  const getEventsForDay = (day: number) =>
    mockEvents.filter((e) => e.day === day);

  const selectedEvents = getEventsForDay(selectedDate);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.headerTitle}>March 2026</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Event</Text>
        </TouchableOpacity>
      </View>

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
              const events = day ? getEventsForDay(day) : [];
              const isToday = day === today;
              const isSelected = day === selectedDate;

              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.dayCell,
                    isToday && styles.todayCell,
                    isSelected && !isToday && styles.selectedCell,
                  ]}
                  onPress={() => day && setSelectedDate(day)}
                  disabled={!day}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isToday && styles.todayText,
                      isSelected && !isToday && styles.selectedText,
                      !day && styles.emptyDay,
                    ]}
                  >
                    {day || ""}
                  </Text>
                  {events.length > 0 && (
                    <View style={styles.eventDots}>
                      {events.slice(0, 3).map((event, j) => (
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

        {/* Selected day events */}
        <View style={styles.eventsSection}>
          <Text style={styles.eventsSectionTitle}>
            {selectedDate === today
              ? "Today's Schedule"
              : `March ${selectedDate}`}
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
                    {event.time} · {event.location}
                  </Text>
                </View>
                <View style={styles.eventCategory}>
                  <Text style={styles.eventCategoryText}>
                    {event.category === "OUTDOOR"
                      ? "🌿"
                      : event.category === "GAME_NIGHT"
                      ? "🎲"
                      : event.category === "DINING"
                      ? "🍝"
                      : "🎬"}
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
});
