import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";

export default function CompleteScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.celebration}>
          <Text style={styles.emoji}>🎉</Text>
        </View>

        <Text style={styles.title}>You&apos;re all set!</Text>
        <Text style={styles.subtitle}>
          FamilySync is ready to help your family plan amazing time together.
          We&apos;re already finding activities perfect for you.
        </Text>

        <View style={styles.highlights}>
          <View style={styles.highlight}>
            <Text style={styles.highlightEmoji}>📅</Text>
            <Text style={styles.highlightText}>
              Your family calendar is ready
            </Text>
          </View>
          <View style={styles.highlight}>
            <Text style={styles.highlightEmoji}>🔍</Text>
            <Text style={styles.highlightText}>
              Personalized recommendations loading
            </Text>
          </View>
          <View style={styles.highlight}>
            <Text style={styles.highlightEmoji}>❤️</Text>
            <Text style={styles.highlightText}>
              You&apos;re helping families worldwide
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.replace("/(tabs)/calendar")}
        >
          <Text style={styles.startButtonText}>
            Start Planning Family Time
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
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 32,
    alignItems: "center",
  },
  celebration: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: colors.amber[50],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.neutral[900],
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral[500],
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  highlights: {
    width: "100%",
    gap: 12,
    marginBottom: 40,
  },
  highlight: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  highlightEmoji: {
    fontSize: 24,
  },
  highlightText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.neutral[700],
  },
  startButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
