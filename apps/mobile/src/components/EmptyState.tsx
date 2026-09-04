import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

interface EmptyStateProps {
  title: string;
  message: string;
  icon: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  message,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: colors.background,
  },
  icon: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.neutral[800],
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: colors.neutral[500],
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
