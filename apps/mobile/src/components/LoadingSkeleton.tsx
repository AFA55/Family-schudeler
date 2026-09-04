import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

type SkeletonVariant = "card" | "list" | "profile" | "calendar";

interface LoadingSkeletonProps {
  variant: SkeletonVariant;
  count?: number;
  style?: ViewStyle;
}

function ShimmerBlock({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: colors.neutral[200],
          opacity,
        },
        style,
      ]}
    />
  );
}

function CardSkeleton() {
  return (
    <View style={styles.card}>
      <ShimmerBlock width="100%" height={140} borderRadius={12} />
      <View style={styles.cardBody}>
        <ShimmerBlock width="70%" height={16} />
        <ShimmerBlock width="50%" height={12} style={{ marginTop: 8 }} />
        <ShimmerBlock width="90%" height={12} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

function ListSkeleton() {
  return (
    <View style={styles.listItem}>
      <ShimmerBlock width={44} height={44} borderRadius={22} />
      <View style={styles.listContent}>
        <ShimmerBlock width="60%" height={14} />
        <ShimmerBlock width="40%" height={12} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

function ProfileSkeleton() {
  return (
    <View style={styles.profile}>
      <ShimmerBlock width={80} height={80} borderRadius={40} />
      <ShimmerBlock
        width={140}
        height={18}
        style={{ marginTop: 16 }}
      />
      <ShimmerBlock
        width={200}
        height={14}
        style={{ marginTop: 8 }}
      />
      <View style={styles.profileStats}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.profileStatBlock}>
            <ShimmerBlock width={48} height={24} />
            <ShimmerBlock width={56} height={12} style={{ marginTop: 4 }} />
          </View>
        ))}
      </View>
    </View>
  );
}

function CalendarSkeleton() {
  return (
    <View style={styles.calendar}>
      <ShimmerBlock width="50%" height={20} style={{ marginBottom: 16 }} />
      <View style={styles.calendarGrid}>
        {Array.from({ length: 7 }).map((_, i) => (
          <ShimmerBlock
            key={`header-${i}`}
            width={32}
            height={12}
            borderRadius={4}
          />
        ))}
      </View>
      {Array.from({ length: 5 }).map((_, row) => (
        <View key={`row-${row}`} style={styles.calendarGrid}>
          {Array.from({ length: 7 }).map((_, col) => (
            <ShimmerBlock
              key={`cell-${row}-${col}`}
              width={32}
              height={32}
              borderRadius={16}
            />
          ))}
        </View>
      ))}
      <View style={styles.calendarEvents}>
        {[1, 2, 3].map((i) => (
          <ShimmerBlock
            key={i}
            width="100%"
            height={52}
            borderRadius={10}
            style={{ marginTop: 8 }}
          />
        ))}
      </View>
    </View>
  );
}

const variantComponents: Record<SkeletonVariant, React.FC> = {
  card: CardSkeleton,
  list: ListSkeleton,
  profile: ProfileSkeleton,
  calendar: CalendarSkeleton,
};

export function LoadingSkeleton({
  variant,
  count = 1,
  style,
}: LoadingSkeletonProps) {
  const SkeletonComponent = variantComponents[variant];

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  cardBody: {
    padding: 14,
  },

  // List
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
  },

  // Profile
  profile: {
    alignItems: "center",
    paddingVertical: 24,
  },
  profileStats: {
    flexDirection: "row",
    marginTop: 24,
    gap: 32,
  },
  profileStatBlock: {
    alignItems: "center",
  },

  // Calendar
  calendar: {
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  calendarEvents: {
    marginTop: 16,
  },
});
