import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ErrorBoundary } from "../src/components/ErrorBoundary";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FEFDFB" },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="event"
          options={{ headerShown: false, presentation: "modal" }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
