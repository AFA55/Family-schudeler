import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { colors, familyColors } from "../../src/theme/colors";
import { useFamilyStore } from "../../src/store/familyStore";
import { useAuthStore } from "../../src/store/authStore";
import { familyAPI } from "../../src/lib/api";
import { LoadingSkeleton } from "../../src/components/LoadingSkeleton";
import { RetryView } from "../../src/components/RetryView";
import { EmptyState } from "../../src/components/EmptyState";

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  email: string | null;
}

export default function FamilyScreen() {
  const { activeFamily, isLoading, fetchFamilies } = useFamilyStore();
  const { user } = useAuthStore();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch families on mount if needed
  useEffect(() => {
    const load = async () => {
      if (!activeFamily && user?.id) {
        setError(null);
        try {
          await fetchFamilies(user.id);
        } catch {
          setError("Failed to load family.");
        }
      }
    };
    load();
  }, [user?.id]);

  // Fetch family members when activeFamily changes
  useEffect(() => {
    const loadMembers = async () => {
      if (!activeFamily?.id) return;
      setMembersLoading(true);
      try {
        const response = await familyAPI.get(activeFamily.id);
        const data = response.data;
        setMembers(data.members ?? data.family?.members ?? []);
      } catch {
        // Members endpoint may not be available yet; show empty state
        setMembers([]);
      } finally {
        setMembersLoading(false);
      }
    };
    loadMembers();
  }, [activeFamily?.id]);

  if (isLoading && !activeFamily) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Family</Text>
        </View>
        <LoadingSkeleton variant="profile" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Family</Text>
        </View>
        <RetryView
          message={error}
          onRetry={() => {
            if (user?.id) {
              setError(null);
              fetchFamilies(user.id).catch(() =>
                setError("Failed to load family.")
              );
            }
          }}
        />
      </View>
    );
  }

  if (!activeFamily) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Family</Text>
        </View>
        <EmptyState
          icon="👨‍👩‍👧‍👦"
          title="No family yet"
          message="Create or join a family to get started!"
        />
      </View>
    );
  }

  const handleCopyInviteCode = () => {
    if (activeFamily.inviteCode) {
      Alert.alert("Invite Code", activeFamily.inviteCode);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Family</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Family Card */}
        <View style={styles.familyCard}>
          <View style={styles.familyHeader}>
            <View style={styles.familyAvatar}>
              <Text style={styles.familyAvatarText}>🏠</Text>
            </View>
            <View style={styles.familyInfo}>
              <Text style={styles.familyName}>{activeFamily.name}</Text>
              <Text style={styles.familyCount}>
                {activeFamily.memberCount} member{activeFamily.memberCount !== 1 ? "s" : ""}
              </Text>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Text style={styles.settingsText}>⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* Invite Code */}
          <View style={styles.inviteCode}>
            <Text style={styles.inviteLabel}>Invite Code</Text>
            <View style={styles.inviteCodeBox}>
              <Text style={styles.inviteCodeText}>{activeFamily.inviteCode}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyInviteCode}>
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Members */}
        <Text style={styles.sectionTitle}>Members</Text>
        {membersLoading ? (
          <LoadingSkeleton variant="list" count={3} />
        ) : members.length > 0 ? (
          members.map((member, index) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={[styles.memberAvatar, { backgroundColor: familyColors[index % familyColors.length] }]}>
                <Text style={styles.memberInitial}>
                  {member.name[0]}
                </Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberEmail}>
                  {member.email || "No email"}
                </Text>
              </View>
              <View style={[styles.roleBadge, member.role === "Admin" && styles.adminBadge]}>
                <Text
                  style={[styles.roleText, member.role === "Admin" && styles.adminText]}
                >
                  {member.role}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyMembersText}>
            Member details will appear here once the family is set up.
          </Text>
        )}

        {/* Add member button */}
        <TouchableOpacity style={styles.addMemberButton}>
          <Text style={styles.addMemberIcon}>+</Text>
          <Text style={styles.addMemberText}>Add Family Member</Text>
        </TouchableOpacity>

        {/* Share calendar */}
        <View style={styles.shareSection}>
          <Text style={styles.sectionTitle}>Share Calendar</Text>
          <Text style={styles.shareDescription}>
            Share a read-only view of your family calendar with extended family
            or friends — no account needed.
          </Text>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Generate Share Link</Text>
          </TouchableOpacity>
        </View>

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
  familyCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  familyHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  familyAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
  },
  familyAvatarText: {
    fontSize: 28,
  },
  familyInfo: {
    flex: 1,
    marginLeft: 14,
  },
  familyName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.neutral[900],
  },
  familyCount: {
    fontSize: 13,
    color: colors.neutral[400],
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
  },
  settingsText: {
    fontSize: 20,
  },
  inviteCode: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  inviteLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.neutral[400],
    marginBottom: 6,
  },
  inviteCodeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inviteCodeText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.neutral[700],
    letterSpacing: 1,
  },
  copyButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyText: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.neutral[800],
    marginTop: 24,
    marginBottom: 12,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  memberInitial: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.neutral[800],
  },
  memberEmail: {
    fontSize: 12,
    color: colors.neutral[400],
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.neutral[100],
  },
  adminBadge: {
    backgroundColor: colors.primary[50],
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.neutral[500],
  },
  adminText: {
    color: colors.primary[600],
  },
  addMemberButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary[50],
    borderWidth: 2,
    borderColor: colors.primary[200],
    borderStyle: "dashed",
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
  },
  addMemberIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary[500],
  },
  addMemberText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary[600],
  },
  shareSection: {
    marginTop: 8,
  },
  shareDescription: {
    fontSize: 13,
    color: colors.neutral[400],
    lineHeight: 20,
    marginBottom: 12,
  },
  shareButton: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: colors.primary[200],
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary[600],
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 15,
    color: colors.coral[500],
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    color: colors.primary[600],
    fontWeight: "600",
    fontSize: 14,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: colors.neutral[400],
    textAlign: "center",
    lineHeight: 22,
  },
  emptyMembersText: {
    fontSize: 14,
    color: colors.neutral[400],
    textAlign: "center",
    paddingVertical: 20,
  },
  loadingRow: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
