import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";

const interests = [
  { id: "hiking", label: "Hiking & Nature", emoji: "🥾" },
  { id: "board-games", label: "Board Games", emoji: "🎲" },
  { id: "cooking", label: "Cooking Together", emoji: "👩‍🍳" },
  { id: "movies", label: "Movie Nights", emoji: "🎬" },
  { id: "crafts", label: "Arts & Crafts", emoji: "🎨" },
  { id: "sports", label: "Sports & Fitness", emoji: "⚽" },
  { id: "dining", label: "Dining Out", emoji: "🍕" },
  { id: "travel", label: "Travel & Road Trips", emoji: "✈️" },
  { id: "camping", label: "Camping", emoji: "⛺" },
  { id: "gardening", label: "Gardening", emoji: "🌱" },
  { id: "music", label: "Music & Concerts", emoji: "🎵" },
  { id: "museums", label: "Museums & Culture", emoji: "🏛️" },
  { id: "beach", label: "Beach & Water", emoji: "🏖️" },
  { id: "volunteering", label: "Volunteering", emoji: "🤝" },
  { id: "reading", label: "Reading & Books", emoji: "📚" },
  { id: "photography", label: "Photography", emoji: "📸" },
];

export default function InterestsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "20%" }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.step}>Step 1 of 5</Text>
        <Text style={styles.title}>What does your family love to do?</Text>
        <Text style={styles.subtitle}>
          Select all that apply. We&apos;ll use this to find perfect activities
          for your family.
        </Text>

        <View style={styles.grid}>
          {interests.map((interest) => {
            const isSelected = selected.includes(interest.id);
            return (
              <TouchableOpacity
                key={interest.id}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => toggle(interest.id)}
              >
                <Text style={styles.chipEmoji}>{interest.emoji}</Text>
                <Text
                  style={[
                    styles.chipLabel,
                    isSelected && styles.chipLabelSelected,
                  ]}
                >
                  {interest.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, selected.length === 0 && styles.nextDisabled]}
          disabled={selected.length === 0}
          onPress={() => router.push("/(onboarding)/goals")}
        >
          <Text style={styles.nextText}>
            Continue ({selected.length} selected)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.neutral[100],
    marginTop: 56,
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.primary[500],
    borderRadius: 2,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  step: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary[500],
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.neutral[900],
    marginBottom: 8,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    color: colors.neutral[500],
    lineHeight: 22,
    marginBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  chipSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[400],
  },
  chipEmoji: {
    fontSize: 18,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.neutral[600],
  },
  chipLabelSelected: {
    color: colors.primary[700],
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 36,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  nextButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  nextDisabled: {
    opacity: 0.4,
  },
  nextText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
