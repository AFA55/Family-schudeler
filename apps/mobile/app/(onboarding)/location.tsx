import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";
import { useOnboardingStore } from "../../src/store/onboardingStore";

const distances = [
  { value: 10, label: "10 mi" },
  { value: 25, label: "25 mi" },
  { value: 50, label: "50 mi" },
  { value: 100, label: "100 mi" },
];

export default function LocationScreen() {
  const router = useRouter();
  const {
    address: savedAddress,
    maxTravelDistance: savedDistance,
    setLocation,
  } = useOnboardingStore();
  const [address, setAddress] = useState(savedAddress);
  const [selectedDistance, setSelectedDistance] = useState(savedDistance);

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "80%" }]} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.step}>Step 4 of 5</Text>
        <Text style={styles.title}>Where are you located?</Text>
        <Text style={styles.subtitle}>
          We&apos;ll find parks, restaurants, and activities near you.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your address or zip code</Text>
          <TextInput
            style={styles.input}
            placeholder="123 Main St or 90210"
            placeholderTextColor={colors.neutral[400]}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <TouchableOpacity style={styles.locationButton}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>Use my current location</Text>
        </TouchableOpacity>

        <Text style={styles.distanceTitle}>
          How far are you willing to travel?
        </Text>
        <View style={styles.distanceRow}>
          {distances.map((d) => (
            <TouchableOpacity
              key={d.value}
              style={[
                styles.distanceChip,
                selectedDistance === d.value && styles.distanceChipSelected,
              ]}
              onPress={() => setSelectedDistance(d.value)}
            >
              <Text
                style={[
                  styles.distanceLabel,
                  selectedDistance === d.value && styles.distanceLabelSelected,
                ]}
              >
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            setLocation({ address, maxTravelDistance: selectedDistance });
            router.push("/(onboarding)/charity");
          }}
        >
          <Text style={styles.nextText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(onboarding)/charity")}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  progressBar: { height: 4, backgroundColor: colors.neutral[100], marginTop: 56 },
  progressFill: { height: 4, backgroundColor: colors.primary[500], borderRadius: 2 },
  content: { flex: 1, padding: 24 },
  back: { fontSize: 15, color: colors.primary[600], fontWeight: "600", marginBottom: 16 },
  step: { fontSize: 13, fontWeight: "600", color: colors.primary[500], marginBottom: 8 },
  title: { fontSize: 26, fontWeight: "800", color: colors.neutral[900], marginBottom: 8 },
  subtitle: { fontSize: 15, color: colors.neutral[500], lineHeight: 22, marginBottom: 24 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "600", color: colors.neutral[700], marginBottom: 6 },
  input: {
    backgroundColor: "white", borderWidth: 1.5, borderColor: colors.neutral[200],
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: colors.neutral[800],
  },
  locationButton: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.primary[50], borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 32,
  },
  locationIcon: { fontSize: 16 },
  locationText: { fontSize: 14, fontWeight: "600", color: colors.primary[600] },
  distanceTitle: { fontSize: 16, fontWeight: "700", color: colors.neutral[800], marginBottom: 12 },
  distanceRow: { flexDirection: "row", gap: 10 },
  distanceChip: {
    flex: 1, alignItems: "center",
    backgroundColor: "white", borderWidth: 1.5, borderColor: colors.neutral[200],
    borderRadius: 12, paddingVertical: 12,
  },
  distanceChipSelected: { backgroundColor: colors.primary[500], borderColor: colors.primary[500] },
  distanceLabel: { fontSize: 14, fontWeight: "700", color: colors.neutral[600] },
  distanceLabelSelected: { color: "white" },
  footer: {
    padding: 20, paddingBottom: 36,
    borderTopWidth: 1, borderTopColor: colors.neutral[100],
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: colors.primary[500], paddingVertical: 16, borderRadius: 16,
    alignItems: "center", width: "100%",
    shadowColor: colors.primary[500], shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  nextText: { color: "white", fontSize: 16, fontWeight: "700" },
  skipText: { fontSize: 14, color: colors.neutral[400], fontWeight: "600", marginTop: 12 },
});
