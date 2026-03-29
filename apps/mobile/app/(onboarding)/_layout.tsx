import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="interests" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="activities" />
      <Stack.Screen name="location" />
      <Stack.Screen name="charity" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
