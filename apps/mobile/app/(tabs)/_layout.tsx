import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../src/theme/colors";

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    calendar: "📅",
    discover: "🔍",
    family: "👨‍👩‍👧‍👦",
    chat: "💬",
    profile: "👤",
  };

  return (
    <View style={[styles.iconContainer, focused && styles.iconFocused]}>
      <Text style={styles.iconText}>{icons[name] || "•"}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ focused }) => <TabIcon name="discover" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: "Family",
          tabBarIcon: ({ focused }) => <TabIcon name="family" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => <TabIcon name="chat" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    borderTopColor: colors.neutral[100],
    borderTopWidth: 1,
    paddingTop: 8,
    height: 88,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  iconFocused: {
    backgroundColor: colors.primary[50],
  },
  iconText: {
    fontSize: 20,
  },
});
