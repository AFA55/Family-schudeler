import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { colors } from "../theme/colors";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error.message);
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.icon}>{"  "}</Text>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              We hit an unexpected problem. Please try again, and if it keeps
              happening, restart the app.
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleRetry}
              activeOpacity={0.8}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>

            {__DEV__ && this.state.error && (
              <ScrollView style={styles.debugContainer}>
                <Text style={styles.debugLabel}>Debug Info</Text>
                <Text style={styles.debugText}>
                  {this.state.error.toString()}
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
    maxWidth: 320,
  },
  icon: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.neutral[800],
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: colors.neutral[500],
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 160,
    alignItems: "center",
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  debugContainer: {
    marginTop: 24,
    backgroundColor: colors.neutral[50],
    borderRadius: 8,
    padding: 12,
    maxHeight: 160,
    width: "100%",
  },
  debugLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.neutral[400],
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  debugText: {
    fontSize: 12,
    color: colors.coral[500],
    fontFamily: "monospace",
  },
});
