import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";
import { useAuthStore } from "../../src/store/authStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/signin");
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      </View>
    );
  }

  const displayName = user?.name ?? "User";
  const displayEmail = user?.email ?? "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{displayEmail}</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planText}>Family Plan</Text>
          </View>
        </View>

        {/* Impact card */}
        <View style={styles.impactCard}>
          <Text style={styles.impactTitle}>Your Impact</Text>
          <Text style={styles.impactDescription}>
            Your subscription helps families in need. You chose to support:
          </Text>
          <View style={styles.impactRegions}>
            <View style={styles.impactRegion}>
              <Text style={styles.impactFlag}>🇺🇸</Text>
              <Text style={styles.impactRegionText}>US Families</Text>
            </View>
            <View style={styles.impactRegion}>
              <Text style={styles.impactFlag}>🌍</Text>
              <Text style={styles.impactRegionText}>Global</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>
        {[
          { icon: "🔔", label: "Notifications", value: "On" },
          { icon: "🎨", label: "Appearance", value: "Light" },
          { icon: "💳", label: "Subscription", value: "Family" },
          { icon: "🔒", label: "Privacy", value: "" },
          { icon: "❓", label: "Help & Support", value: "" },
          { icon: "📋", label: "Terms of Service", value: "" },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.settingRow}>
            <Text style={styles.settingIcon}>{item.icon}</Text>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingValue}>{item.value}</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>FamilySync v1.0.0</Text>

        <View style={{ height: 32 }} />
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.neutral[900],
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  userCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatarText: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
  },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.neutral[900],
  },
  userEmail: {
    fontSize: 14,
    color: colors.neutral[400],
    marginTop: 2,
  },
  planBadge: {
    backgroundColor: colors.amber[50],
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 12,
  },
  planText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.amber[600],
  },
  impactCard: {
    backgroundColor: colors.primary[50],
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary[700],
    marginBottom: 4,
  },
  impactDescription: {
    fontSize: 13,
    color: colors.primary[500],
    lineHeight: 18,
    marginBottom: 12,
  },
  impactRegions: {
    flexDirection: "row",
    gap: 10,
  },
  impactRegion: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  impactFlag: {
    fontSize: 16,
  },
  impactRegionText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary[600],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.neutral[800],
    marginTop: 24,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginBottom: 6,
  },
  settingIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.neutral[700],
  },
  settingValue: {
    fontSize: 13,
    color: colors.neutral[400],
    marginRight: 4,
  },
  settingArrow: {
    fontSize: 20,
    color: colors.neutral[300],
  },
  logoutButton: {
    marginTop: 24,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: colors.coral[50],
    borderRadius: 14,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.coral[500],
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: colors.neutral[300],
    marginTop: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
