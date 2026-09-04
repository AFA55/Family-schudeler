import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { colors } from "../../src/theme/colors";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Family Chat</Text>
      </View>

      <View style={styles.comingSoonContainer}>
        <Text style={styles.comingSoonEmoji}>💬</Text>
        <Text style={styles.comingSoonTitle}>Chat coming soon</Text>
        <Text style={styles.comingSoonText}>
          Family chat with AI planning assistant is being built. Stay tuned!
        </Text>
      </View>
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.neutral[900],
  },
  comingSoonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  comingSoonEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.neutral[800],
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 15,
    color: colors.neutral[400],
    textAlign: "center",
    lineHeight: 22,
  },
});
