// ============================================
// Push Notification Setup (Expo)
// ============================================
//
// Uses expo-notifications to register for push tokens,
// handle incoming foreground notifications, and respond
// to notification taps. expo-device is used to detect
// whether the app is running on a physical device (push
// notifications are not available on simulators).
//
// Note: expo-notifications is already in package.json.
// If expo-device is missing, install it:
//   npx expo install expo-device

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// --------------------------------------------
// Types
// --------------------------------------------

export type PushNotificationData = {
  type?: string;
  screenPath?: string; // e.g. "/events/abc123" or "/chat/rooms/xyz"
  [key: string]: unknown;
};

// --------------------------------------------
// Configuration
// --------------------------------------------

// Set the default notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// --------------------------------------------
// Registration
// --------------------------------------------

/**
 * Register for push notifications and return the Expo push token.
 *
 * On Android, creates a default notification channel.
 * On simulators, logs a warning and returns null.
 *
 * Usage:
 * ```ts
 * const token = await registerForPushNotifications();
 * if (token) {
 *   // Send token to your API for storage
 * }
 * ```
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // expo-device may not be installed yet; handle gracefully
  let isDevice = true;
  try {
    const Device = require("expo-device");
    isDevice = Device.isDevice;
  } catch {
    // expo-device not available, assume physical device
    if (__DEV__) {
      console.warn(
        "[PushNotifications] expo-device not installed. Install with: npx expo install expo-device"
      );
    }
  }

  if (!isDevice) {
    if (__DEV__) {
      console.warn(
        "[PushNotifications] Push notifications are not available on simulators."
      );
    }
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permission if not already granted
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    if (__DEV__) {
      console.warn(
        "[PushNotifications] Permission not granted for push notifications."
      );
    }
    return null;
  }

  // Create Android notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "FamilySync",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#6366F1", // Primary indigo
    });
  }

  // Get the Expo push token
  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    if (__DEV__) {
      console.log("[PushNotifications] Expo push token:", token);
    }

    return token;
  } catch (error) {
    if (__DEV__) {
      console.error("[PushNotifications] Failed to get push token:", error);
    }
    return null;
  }
}

// --------------------------------------------
// Foreground notification handler
// --------------------------------------------

/**
 * Handle a notification received while the app is in the foreground.
 *
 * Call this from a `Notifications.addNotificationReceivedListener` callback.
 *
 * ```ts
 * Notifications.addNotificationReceivedListener(handleNotificationReceived);
 * ```
 */
export function handleNotificationReceived(
  notification: Notifications.Notification
): void {
  const { title, body, data } = notification.request.content;

  if (__DEV__) {
    console.log("[PushNotifications] Received in foreground:", {
      title,
      body,
      data,
    });
  }

  // The notification is automatically shown to the user via the
  // setNotificationHandler config above. Additional in-app handling
  // (e.g. updating a badge count in Zustand) can be added here.
}

// --------------------------------------------
// Notification tap handler
// --------------------------------------------

/**
 * Handle a notification tap (user interacted with the notification).
 *
 * Reads the `screenPath` from the notification data and navigates
 * to the relevant screen using Expo Router.
 *
 * Call this from a `Notifications.addNotificationResponseReceivedListener` callback.
 *
 * ```ts
 * Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
 * ```
 */
export function handleNotificationResponse(
  response: Notifications.NotificationResponse
): void {
  const data = response.notification.request.content
    .data as PushNotificationData;

  if (__DEV__) {
    console.log("[PushNotifications] Notification tapped:", data);
  }

  if (data?.screenPath) {
    // Use Expo Router for navigation. The dynamic import avoids
    // a hard dependency on expo-router at module load time.
    try {
      const { router } = require("expo-router");
      router.push(data.screenPath);
    } catch (error) {
      if (__DEV__) {
        console.warn(
          "[PushNotifications] Failed to navigate to:",
          data.screenPath,
          error
        );
      }
    }
  }
}

// --------------------------------------------
// Listener setup helper
// --------------------------------------------

/**
 * Set up all notification listeners. Call once at app startup
 * (e.g. in your root layout or App component).
 *
 * Returns a cleanup function to remove the listeners.
 *
 * ```ts
 * useEffect(() => {
 *   const cleanup = setupNotificationListeners();
 *   return cleanup;
 * }, []);
 * ```
 */
export function setupNotificationListeners(): () => void {
  const receivedSubscription =
    Notifications.addNotificationReceivedListener(handleNotificationReceived);

  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}
