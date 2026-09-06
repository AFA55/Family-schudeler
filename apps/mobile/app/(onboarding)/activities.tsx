import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";
import { useOnboardingStore } from "../../src/store/onboardingStore";

const activityTypes = [
  { id: "at-home", label: "At-home activities", emoji: "🏠", description: "Board games, movie nights, crafts" },
  { id: "outdoor", label: "Outdoor adventures", emoji: "🌿", description: "Hiking, parks, sports" },
  { id: "dining", label: "Dining & restaurants", emoji: "🍽️", description: "Family meals out" },
  { id: "day-trips", label: "Day trips", emoji: "🚗", description: "Nearby attractions & events" },
  { id: "weekend", label: "Weekend getaways", emoji: "🏕️", description: "Short trips & camping" },
  { id: "free", label: "Free activities", emoji: "🆓", description: "No-cost family fun" },
  { id: "educational", label: "Educational", emoji: "📚", description: "Museums, science centers" },
  { id: "seasonal", label: "Seasonal events", emoji: "🎃", description: "Holiday & seasonal activities" },
];

const budgets = [
  { id: "free", label: "Free only", emoji: "🆓" },
  { id: "budget", label: "Under $25", emoji: "💵" },
  { id: "moderate", label: "$25-$75", emoji: "💰" },
  { id: "any", label: "Any budget", emoji: "✨" },
];

export default function ActivitiesScreen() {
  const router = useRouter();
  const {
    activityTypes: savedTypes,
    preferredBudget: savedBudget,
    wantRecommendations: savedWantRecs,
    setActivities,
  } = useOnboardingStore();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(savedTypes);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(savedBudget);
  const [wantRecs, setWantRecs] = useState(savedWantRecs);

  const toggleType = (id: string) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "60%" }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.step}>Step 3 of 5</Text>
        <Text style={styles.title}>What kind of activities?</Text>
        <Text style={styles.subtitle}>
          Select the types of activities your family enjoys.
        </Text>

        <View style={styles.grid}>
          {activityTypes.map((type) => {
            const isSelected = selectedTypes.includes(type.id);
            return (
              <TouchableOpacity
                key={type.id}
                style={[styles.typeCard, isSelected && styles.typeCardSelected]}
                onPress={() => toggleType(type.id)}
              >
                <Text style={styles.typeEmoji}>{type.emoji}</Text>
                <Text style={[styles.typeLabel, isSelected && styles.typeLabelSelected]}>
                  {type.label}
                </Text>
                <Text style={styles.typeDesc}>{type.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Budget */}
        <Text style={styles.sectionTitle}>Preferred budget per activity</Text>
        <View style={styles.budgetRow}>
          {budgets.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={[styles.budgetChip, selectedBudget === b.id && styles.budgetChipSelected]}
              onPress={() => setSelectedBudget(b.id)}
            >
              <Text style={styles.budgetEmoji}>{b.emoji}</Text>
              <Text style={[styles.budgetLabel, selectedBudget === b.id && styles.budgetLabelSelected]}>
                {b.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommendations toggle */}
        <TouchableOpacity
          style={styles.recToggle}
          onPress={() => setWantRecs(!wantRecs)}
        >
          <View style={styles.recToggleContent}>
            <Text style={styles.recToggleTitle}>Get smart recommendations</Text>
            <Text style={styles.recToggleDesc}>
              Board games, crafts, activities curated for your family
            </Text>
          </View>
          <View style={[styles.toggle, wantRecs && styles.toggleActive]}>
            <View style={[styles.toggleDot, wantRecs && styles.toggleDotActive]} />
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            setActivities({
              activityTypes: selectedTypes,
              preferredBudget: selectedBudget,
              wantRecommendations: wantRecs,
            });
            router.push("/(onboarding)/location");
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
  scrollContent: { padding: 24, paddingBottom: 120 },
  back: { fontSize: 15, color: colors.primary[600], fontWeight: "600", marginBottom: 16 },
  step: { fontSize: 13, fontWeight: "600", color: colors.primary[500], marginBottom: 8 },
  title: { fontSize: 26, fontWeight: "800", color: colors.neutral[900], marginBottom: 8 },
  subtitle: { fontSize: 15, color: colors.neutral[500], marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeCard: {
    width: "48%",
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    borderRadius: 16,
    padding: 14,
  },
  typeCardSelected: { backgroundColor: colors.primary[50], borderColor: colors.primary[400] },
  typeEmoji: { fontSize: 28, marginBottom: 6 },
  typeLabel: { fontSize: 14, fontWeight: "700", color: colors.neutral[700] },
  typeLabelSelected: { color: colors.primary[700] },
  typeDesc: { fontSize: 11, color: colors.neutral[400], marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.neutral[800], marginTop: 24, marginBottom: 12 },
  budgetRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  budgetChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  budgetChipSelected: { backgroundColor: colors.primary[50], borderColor: colors.primary[400] },
  budgetEmoji: { fontSize: 14 },
  budgetLabel: { fontSize: 13, fontWeight: "600", color: colors.neutral[600] },
  budgetLabelSelected: { color: colors.primary[700] },
  recToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
  },
  recToggleContent: { flex: 1 },
  recToggleTitle: { fontSize: 15, fontWeight: "700", color: colors.neutral[800] },
  recToggleDesc: { fontSize: 12, color: colors.neutral[400], marginTop: 2 },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.neutral[200],
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleActive: { backgroundColor: colors.primary[500] },
  toggleDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
  },
  toggleDotActive: { alignSelf: "flex-end" },
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 36,
    backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.neutral[100],
  },
  nextButton: {
    backgroundColor: colors.primary[500], paddingVertical: 16, borderRadius: 16,
    alignItems: "center",
    shadowColor: colors.primary[500], shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  nextText: { color: "white", fontSize: 16, fontWeight: "700" },
});
