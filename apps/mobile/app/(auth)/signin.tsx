import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      // TODO: Connect to API
      router.replace("/(tabs)/calendar");
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to your FamilySync account
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.neutral[400]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Your password"
              placeholderTextColor={colors.neutral[400]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text style={styles.switchText}>
              Don&apos;t have an account?{" "}
              <Text style={styles.switchLink}>Start free trial</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    color: colors.primary[600],
    fontWeight: "600",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.neutral[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral[500],
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.neutral[700],
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.neutral[800],
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -12,
  },
  forgotText: {
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: "600",
  },
  submitButton: {
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
  submitDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  switchText: {
    textAlign: "center",
    fontSize: 14,
    color: colors.neutral[500],
    marginTop: 8,
  },
  switchLink: {
    color: colors.primary[600],
    fontWeight: "600",
  },
});
