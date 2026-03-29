import { Redirect } from "expo-router";
import { useAuthStore } from "../src/store/authStore";

export default function Index() {
  const { user, isOnboarded } = useAuthStore();

  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (!isOnboarded) {
    return <Redirect href="/(onboarding)/interests" />;
  }

  return <Redirect href="/(tabs)/calendar" />;
}
