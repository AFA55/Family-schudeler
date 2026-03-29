import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";

const regions = [
  { id: "US", label: "Families in the US", flag: "🇺🇸", description: "Support local families in need" },
  { id: "GLOBAL", label: "Families worldwide", flag: "🌍", description: "Help families across the globe" },
  { id: "AFRICA", label: "Families in Africa", flag: "🌍", description: "Education, food & shelter" },
  { id: "ASIA", label: "Families in Asia", flag: "🌏", description: "Healthcare & clean water" },
  { id: "LATIN_AMERICA", label: "Latin America", flag: "🌎", description: "Community & education" },
  { id: "MIDDLE_EAST", label: "Middle East", flag: "🕊️", description: "Refugee family support" },
];

export default function CharityScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "100%" }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.step}>Step 5 of 5</Text>
        <Text style={styles.title}>Choose who you help</Text>
        <Text style={styles.subtitle}>
          87% of our profits go directly to helping families in need. Choose
          which communities matter most to you.
        </Text>

        {/* Impact visual */}
        <View style={styles.impactCard}>
          <Text style={styles.impactNumber}>87%</Text>
          <Text style={styles.impactText}>
            of profits donated to family charities worldwide
          </Text>
        </View>

        <View style={styles.list}>
          {regions.map((region) => {
            const isSelected = selected.includes(region.id);
            return (
              <TouchableOpacity
                key={region.id}
                style={[styles.regionCard, isSelected && styles.regionCardSelected]}
                onPress={() => toggle(region.id)}
              >
                <Text style={styles.regionFlag}>{region.flag}</Text>
                <View style={styles.regionInfo}>
                  <Text style={[styles.regionLabel, isSelected && styles.regionLabelSelected]}>
                    {region.label}
                  </Text>
                  <Text style={styles.regionDesc}>{region.description}</Text>
                </View>
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
          onPress={() => router.replace("/(onboarding)/complete")}
        >
          <Text style={styles.nextText}>Complete Setup</Text>
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
  subtitle: { fontSize: 15, color: colors.neutral[500], lineHeight: 22, marginBottom: 20 },
  impactCard: {
    backgroundColor: colors.coral[50], borderRadius: 20, padding: 20,
    alignItems: "center", marginBottom: 24,
    borderWidth: 1, borderColor: colors.coral[100],
  },
  impactNumber: { fontSize: 48, fontWeight: "800", color: colors.coral[500] },
  impactText: { fontSize: 14, color: colors.coral[600], textAlign: "center", fontWeight: "600" },
  list: { gap: 10 },
  regionCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "white", borderWidth: 1.5,
    borderColor: colors.neutral[200], borderRadius: 16, padding: 16, gap: 14,
  },
  regionCardSelected: { backgroundColor: colors.primary[50], borderColor: colors.primary[400] },
  regionFlag: { fontSize: 32 },
  regionInfo: { flex: 1 },
  regionLabel: { fontSize: 15, fontWeight: "700", color: colors.neutral[700] },
  regionLabelSelected: { color: colors.primary[700] },
  regionDesc: { fontSize: 12, color: colors.neutral[400], marginTop: 2 },
  checkmark: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: colors.primary[500], alignItems: "center", justifyContent: "center",
  },
  checkmarkText: { color: "white", fontWeight: "700", fontSize: 14 },
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 36,
    backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.neutral[100],
  },
  nextButton: {
    backgroundColor: colors.coral[500], paddingVertical: 16, borderRadius: 16,
    alignItems: "center",
    shadowColor: colors.coral[500], shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  nextDisabled: { opacity: 0.4 },
  nextText: { color: "white", fontSize: 16, fontWeight: "700" },
});
