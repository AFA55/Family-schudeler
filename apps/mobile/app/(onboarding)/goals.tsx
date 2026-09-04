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
import { useOnboardingStore } from "../../src/store/onboardingStore";

const goals = [
  { id: "quality-time", label: "More quality family time", emoji: "❤️" },
  { id: "organized", label: "Be more organized", emoji: "📋" },
  { id: "new-activities", label: "Find new activities to do together", emoji: "🔍" },
  { id: "coordinate", label: "Better coordinate busy schedules", emoji: "📅" },
  { id: "traditions", label: "Create lasting family traditions", emoji: "🌟" },
  { id: "screen-time", label: "Reduce screen time", emoji: "📵" },
  { id: "explore", label: "Explore our local area", emoji: "🗺️" },
  { id: "save-money", label: "Save money on activities", emoji: "💰" },
];

export default function GoalsScreen() {
  const router = useRouter();
  const { goals: savedGoals, setGoals } = useOnboardingStore();
  const [selected, setSelected] = useState<string[]>(savedGoals);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "40%" }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.step}>Step 2 of 5</Text>
        <Text style={styles.title}>
          What do you want to get out of FamilySync?
        </Text>
        <Text style={styles.subtitle}>
          This helps us personalize your experience.
        </Text>

        <View style={styles.list}>
          {goals.map((goal) => {
            const isSelected = selected.includes(goal.id);
            return (
              <TouchableOpacity
                key={goal.id}
                style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                onPress={() => toggle(goal.id)}
              >
                <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                <Text
                  style={[
                    styles.goalLabel,
                    isSelected && styles.goalLabelSelected,
                  ]}
                >
                  {goal.label}
                </Text>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, selected.length === 0 && styles.nextDisabled]}
          disabled={selected.length === 0}
          onPress={() => {
            setGoals(selected);
            router.push("/(onboarding)/activities");
          }}
        >
          <Text style={styles.nextText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  progressBar: { height: 4, backgroundColor: colors.neutral[100], marginTop: 56 },
  progressFill: { height: 4, backgroundColor: colors.primary[500], borderRadius: 2 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  back: { fontSize: 15, color: colors.primary[600], fontWeight: "600", marginBottom: 16 },
  step: { fontSize: 13, fontWeight: "600", color: colors.primary[500], marginBottom: 8 },
  title: { fontSize: 26, fontWeight: "800", color: colors.neutral[900], marginBottom: 8, lineHeight: 32 },
  subtitle: { fontSize: 15, color: colors.neutral[500], marginBottom: 24 },
  list: { gap: 10 },
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  goalCardSelected: { backgroundColor: colors.primary[50], borderColor: colors.primary[400] },
  goalEmoji: { fontSize: 24 },
  goalLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: colors.neutral[700] },
  goalLabelSelected: { color: colors.primary[700] },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: { color: "white", fontWeight: "700", fontSize: 14 },
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
  nextDisabled: { opacity: 0.4 },
  nextText: { color: "white", fontSize: 16, fontWeight: "700" },
});
