// ============================================
// Analytics Wrapper
// ============================================
//
// Provider-agnostic analytics API. Currently logs to console
// in development mode. Swap the implementation to Mixpanel,
// PostHog, Amplitude, or any other provider without changing
// call sites.

// --------------------------------------------
// Event definitions
// --------------------------------------------

export type AnalyticsEvent =
  | "signup"
  | "onboarding_complete"
  | "first_event_created"
  | "first_family_member_invited"
  | "trial_started"
  | "subscription_converted"
  | "event_rsvp"
  | "discover_activity_viewed"
  | "chat_message_sent"
  | "ai_assistant_used";

export type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

export type UserTraits = {
  email?: string;
  name?: string;
  plan?: string;
  familyCount?: number;
  createdAt?: string;
  city?: string;
  charityRegion?: string;
  [key: string]: string | number | boolean | null | undefined;
};

// --------------------------------------------
// Provider interface
// --------------------------------------------

interface AnalyticsProvider {
  track(event: AnalyticsEvent, properties?: AnalyticsProperties): void;
  identify(userId: string, traits?: UserTraits): void;
  screen(name: string, properties?: AnalyticsProperties): void;
  reset(): void;
}

// --------------------------------------------
// Console provider (development)
// --------------------------------------------

const consoleProvider: AnalyticsProvider = {
  track(event, properties) {
    if (__DEV__) {
      console.log(
        `[Analytics] track: ${event}`,
        properties ? JSON.stringify(properties, null, 2) : ""
      );
    }
  },

  identify(userId, traits) {
    if (__DEV__) {
      console.log(
        `[Analytics] identify: ${userId}`,
        traits ? JSON.stringify(traits, null, 2) : ""
      );
    }
  },

  screen(name, properties) {
    if (__DEV__) {
      console.log(
        `[Analytics] screen: ${name}`,
        properties ? JSON.stringify(properties, null, 2) : ""
      );
    }
  },

  reset() {
    if (__DEV__) {
      console.log("[Analytics] reset: user session cleared");
    }
  },
};

// --------------------------------------------
// Noop provider (production fallback)
// --------------------------------------------

const noopProvider: AnalyticsProvider = {
  track() {},
  identify() {},
  screen() {},
  reset() {},
};

// --------------------------------------------
// Analytics singleton
// --------------------------------------------

let activeProvider: AnalyticsProvider = __DEV__ ? consoleProvider : noopProvider;

/**
 * Replace the active analytics provider.
 *
 * Call this once at app startup after initializing your
 * analytics SDK (e.g. Mixpanel, PostHog):
 *
 * ```ts
 * import { setProvider } from "@/lib/analytics";
 * import { mixpanelProvider } from "./mixpanelProvider";
 *
 * setProvider(mixpanelProvider);
 * ```
 */
export function setProvider(provider: AnalyticsProvider): void {
  activeProvider = provider;
}

/**
 * Public analytics API.
 *
 * Usage:
 * ```ts
 * import { analytics } from "@/lib/analytics";
 *
 * analytics.track("signup", { method: "email" });
 * analytics.identify("user_123", { name: "Jane", plan: "plus" });
 * analytics.screen("Calendar");
 * ```
 */
export const analytics = {
  /**
   * Track a discrete event.
   */
  track(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
    try {
      activeProvider.track(event, {
        timestamp: new Date().toISOString(),
        ...properties,
      });
    } catch (error) {
      if (__DEV__) {
        console.warn("[Analytics] track error:", error);
      }
    }
  },

  /**
   * Identify a user and attach traits to their profile.
   */
  identify(userId: string, traits?: UserTraits): void {
    try {
      activeProvider.identify(userId, traits);
    } catch (error) {
      if (__DEV__) {
        console.warn("[Analytics] identify error:", error);
      }
    }
  },

  /**
   * Record a screen view.
   */
  screen(name: string, properties?: AnalyticsProperties): void {
    try {
      activeProvider.screen(name, {
        timestamp: new Date().toISOString(),
        ...properties,
      });
    } catch (error) {
      if (__DEV__) {
        console.warn("[Analytics] screen error:", error);
      }
    }
  },

  /**
   * Reset the analytics state (e.g. on sign-out).
   * Clears the identified user so subsequent events
   * are anonymous.
   */
  reset(): void {
    try {
      activeProvider.reset();
    } catch (error) {
      if (__DEV__) {
        console.warn("[Analytics] reset error:", error);
      }
    }
  },
};

export default analytics;
