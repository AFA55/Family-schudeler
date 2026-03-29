import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>F</Text>
          </View>
          <Text style={styles.brandName}>
            Family<Text style={styles.brandAccent}>Sync</Text>
          </Text>
        </View>

        {/* Tagline */}
        <Text style={styles.title}>
          Quality family time,{"\n"}effortlessly planned
        </Text>
        <Text style={styles.subtitle}>
          Smart scheduling for busy families. Plan activities, discover
          experiences, and make every moment count.
        </Text>

        {/* Impact badge */}
        <View style={styles.impactBadge}>
          <View style={styles.impactDot} />
          <Text style={styles.impactText}>
            87% of profits help families in need worldwide
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text style={styles.primaryButtonText}>
              Start 14-Day Free Trial
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/(auth)/signin")}
          >
            <Text style={styles.secondaryButtonText}>
              I already have an account
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          No credit card required. Cancel anytime.
        </Text>
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
  bgCircle1: {
    position: "absolute",
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primary[100],
    opacity: 0.5,
  },
  bgCircle2: {
    position: "absolute",
    bottom: -80,
    left: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.coral[100],
    opacity: 0.3,
  },
  content: {
    paddingHorizontal: 32,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
  },
  brandName: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.neutral[900],
  },
  brandAccent: {
    color: colors.primary[500],
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.neutral[900],
    textAlign: "center",
    lineHeight: 40,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral[500],
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  impactBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 40,
  },
  impactDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.coral[500],
    marginRight: 8,
  },
  impactText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary[700],
  },
  buttons: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary[200],
  },
  secondaryButtonText: {
    color: colors.primary[600],
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimer: {
    fontSize: 12,
    color: colors.neutral[400],
    marginTop: 16,
  },
});
