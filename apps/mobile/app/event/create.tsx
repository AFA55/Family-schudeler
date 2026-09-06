import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { colors, familyColors } from "../../src/theme/colors";
import { useAuthStore } from "../../src/store/authStore";
import { useFamilyStore } from "../../src/store/familyStore";
import { RetryView } from "../../src/components/RetryView";
import type { EventCategory } from "@familysync/shared";

// Category display config with emoji and color
const CATEGORY_OPTIONS: {
  value: EventCategory;
  label: string;
  emoji: string;
  color: string;
}[] = [
  { value: "GENERAL", label: "General", emoji: "📅", color: "#6366F1" },
  { value: "FAMILY_TIME", label: "Family Time", emoji: "🏠", color: "#FF6B6B" },
  { value: "OUTDOOR", label: "Outdoor", emoji: "🌿", color: "#10B981" },
  { value: "DINING", label: "Dining Out", emoji: "🍕", color: "#F59E0B" },
  { value: "MOVIE_NIGHT", label: "Movie Night", emoji: "🎬", color: "#8B5CF6" },
  { value: "GAME_NIGHT", label: "Game Night", emoji: "🎲", color: "#06B6D4" },
  { value: "ADVENTURE", label: "Adventure", emoji: "🏔️", color: "#059669" },
  { value: "SPORTS", label: "Sports", emoji: "⚽", color: "#EA580C" },
  { value: "CRAFTS", label: "Crafts", emoji: "🎨", color: "#EC4899" },
  { value: "HOLIDAY", label: "Holiday", emoji: "🎁", color: "#DC2626" },
  { value: "BIRTHDAY", label: "Birthday", emoji: "🎂", color: "#D946EF" },
  { value: "TRAVEL", label: "Travel", emoji: "✈️", color: "#0284C7" },
  { value: "APPOINTMENT", label: "Appointment", emoji: "⏰", color: "#78716C" },
];

// Mock family members (consistent with the family screen)
const mockMembers = [
  { id: "1", name: "Marcus", color: familyColors[0] },
  { id: "2", name: "Sarah", color: familyColors[3] },
  { id: "3", name: "Emma", color: familyColors[1] },
  { id: "4", name: "Jake", color: familyColors[2] },
];

/**
 * Format a date string hint like "2026-09-04" or "2026-09-04 14:00"
 * depending on whether allDay is set.
 */
function getDefaultStartDate(): string {
  const now = new Date();
  // Round up to the next hour
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 1);
  return formatDateTime(now);
}

function getDefaultEndDate(): string {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 2);
  return formatDateTime(now);
}

function formatDateTime(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${mins}`;
}

function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parse "YYYY-MM-DD" or "YYYY-MM-DD HH:mm" into a Date, returns null on failure. */
function parseInput(value: string): Date | null {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
  const dateTime = /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}$/;
  if (dateOnly.test(value.trim())) {
    const d = new Date(value.trim() + "T00:00:00");
    return isNaN(d.getTime()) ? null : d;
  }
  if (dateTime.test(value.trim())) {
    const d = new Date(value.trim().replace(" ", "T") + ":00");
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export default function CreateEventScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const activeFamily = useFamilyStore((s) => s.activeFamily);
  const createEvent = useFamilyStore((s) => s.createEvent);

  // Form state
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(getDefaultStartDate);
  const [endTime, setEndTime] = useState(getDefaultEndDate);
  const [allDay, setAllDay] = useState(false);
  const [category, setCategory] = useState<EventCategory>("GENERAL");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleMember(memberId: string) {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    const parsedStart = parseInput(startTime);
    if (!parsedStart) {
      newErrors.startTime = allDay
        ? "Enter a valid date (YYYY-MM-DD)"
        : "Enter a valid date and time (YYYY-MM-DD HH:mm)";
    }

    const parsedEnd = parseInput(endTime);
    if (!parsedEnd) {
      newErrors.endTime = allDay
        ? "Enter a valid date (YYYY-MM-DD)"
        : "Enter a valid date and time (YYYY-MM-DD HH:mm)";
    }

    if (parsedStart && parsedEnd && parsedEnd <= parsedStart) {
      newErrors.endTime = "End time must be after start time";
    }

    if (cost && isNaN(Number(cost.replace(/[^0-9.]/g, "")))) {
      newErrors.cost = "Enter a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleCreate() {
    if (!validate()) return;
    if (!user || !activeFamily) {
      Alert.alert("Error", "Please sign in and select a family first.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const parsedStart = parseInput(startTime)!;
      const parsedEnd = parseInput(endTime)!;

      await createEvent({
        familyId: activeFamily.id,
        creatorId: user.id,
        title: title.trim(),
        startTime: parsedStart.toISOString(),
        endTime: parsedEnd.toISOString(),
        allDay,
        category,
        location: location.trim() || undefined,
        description: description.trim() || undefined,
        cost: cost.trim() || undefined,
        attendeeIds:
          selectedMembers.length > 0 ? selectedMembers : undefined,
      });

      Alert.alert("Event Created", `"${title.trim()}" has been added to your calendar.`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Event</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Family movie night, Hiking trip..."
            placeholderTextColor={colors.neutral[300]}
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (errors.title) setErrors((e) => ({ ...e, title: "" }));
            }}
          />
          {errors.title ? (
            <Text style={styles.errorText}>{errors.title}</Text>
          ) : null}
        </View>

        {/* All Day Toggle */}
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>All-day event</Text>
          <Switch
            value={allDay}
            onValueChange={setAllDay}
            trackColor={{
              false: colors.neutral[200],
              true: colors.primary[200],
            }}
            thumbColor={allDay ? colors.primary[500] : colors.neutral[50]}
          />
        </View>

        {/* Start Time */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Start {allDay ? "Date" : "Date & Time"}{" "}
            <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.startTime && styles.inputError]}
            placeholder={allDay ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
            placeholderTextColor={colors.neutral[300]}
            value={startTime}
            onChangeText={(t) => {
              setStartTime(t);
              if (errors.startTime)
                setErrors((e) => ({ ...e, startTime: "" }));
            }}
          />
          {errors.startTime ? (
            <Text style={styles.errorText}>{errors.startTime}</Text>
          ) : null}
        </View>

        {/* End Time */}
        <View style={styles.section}>
          <Text style={styles.label}>
            End {allDay ? "Date" : "Date & Time"}{" "}
            <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.endTime && styles.inputError]}
            placeholder={allDay ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
            placeholderTextColor={colors.neutral[300]}
            value={endTime}
            onChangeText={(t) => {
              setEndTime(t);
              if (errors.endTime) setErrors((e) => ({ ...e, endTime: "" }));
            }}
          />
          {errors.endTime ? (
            <Text style={styles.errorText}>{errors.endTime}</Text>
          ) : null}
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            <View style={styles.categoryRow}>
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = category === cat.value;
                return (
                  <TouchableOpacity
                    key={cat.value}
                    style={[
                      styles.categoryChip,
                      isSelected && {
                        backgroundColor: cat.color,
                        borderColor: cat.color,
                      },
                    ]}
                    onPress={() => setCategory(cat.value)}
                  >
                    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                    <Text
                      style={[
                        styles.categoryLabel,
                        isSelected && styles.categoryLabelSelected,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Home, Park, Restaurant name..."
            placeholderTextColor={colors.neutral[300]}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Add details, notes, or a packing list..."
            placeholderTextColor={colors.neutral[300]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Cost Estimate */}
        <View style={styles.section}>
          <Text style={styles.label}>Estimated Cost</Text>
          <TextInput
            style={[styles.input, errors.cost && styles.inputError]}
            placeholder="$0.00"
            placeholderTextColor={colors.neutral[300]}
            value={cost}
            onChangeText={(t) => {
              setCost(t);
              if (errors.cost) setErrors((e) => ({ ...e, cost: "" }));
            }}
            keyboardType="decimal-pad"
          />
          {errors.cost ? (
            <Text style={styles.errorText}>{errors.cost}</Text>
          ) : null}
        </View>

        {/* Family Members */}
        <View style={styles.section}>
          <Text style={styles.label}>Invite Family Members</Text>
          <View style={styles.membersList}>
            {mockMembers.map((member) => {
              const isSelected = selectedMembers.includes(member.id);
              return (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    styles.memberRow,
                    isSelected && styles.memberRowSelected,
                  ]}
                  onPress={() => toggleMember(member.id)}
                >
                  <View
                    style={[
                      styles.memberAvatar,
                      { backgroundColor: member.color },
                    ]}
                  >
                    <Text style={styles.memberInitial}>
                      {member.name[0]}
                    </Text>
                  </View>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && (
                      <Text style={styles.checkmark}>{"✓"}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Submission Error */}
        {submitError && (
          <RetryView
            message={submitError}
            onRetry={handleCreate}
          />
        )}

        {/* Create Button */}
        <TouchableOpacity
          style={[
            styles.createButton,
            isSubmitting && styles.createButtonDisabled,
          ]}
          onPress={handleCreate}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.createButtonText}>Create Event</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
    backgroundColor: colors.background,
  },
  backButton: {
    width: 60,
  },
  backText: {
    fontSize: 16,
    color: colors.primary[500],
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.neutral[900],
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.neutral[700],
    marginBottom: 8,
  },
  required: {
    color: colors.coral[500],
  },
  input: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.neutral[800],
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
  },
  inputError: {
    borderColor: colors.coral[500],
  },
  textarea: {
    minHeight: 100,
    paddingTop: 14,
  },
  errorText: {
    fontSize: 12,
    color: colors.coral[500],
    marginTop: 4,
    marginLeft: 4,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.neutral[700],
  },
  categoryScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryRow: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 20,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    gap: 6,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.neutral[600],
  },
  categoryLabelSelected: {
    color: "white",
  },
  membersList: {
    gap: 8,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
  },
  memberRowSelected: {
    borderColor: colors.primary[400],
    backgroundColor: colors.primary[50],
  },
  memberAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  memberInitial: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  memberName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.neutral[800],
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  checkmark: {
    color: "white",
    fontSize: 14,
    fontWeight: "800",
  },
  createButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
});
