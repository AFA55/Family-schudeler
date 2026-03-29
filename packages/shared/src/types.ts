// ============================================
// Core Types shared between web & mobile
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
}

export interface FamilyInfo {
  id: string;
  name: string;
  color: string;
  avatarUrl?: string;
  inviteCode: string;
  memberCount: number;
}

export interface CalendarEvent {
  id: string;
  familyId: string;
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  category: EventCategory;
  color?: string;
  cost?: string;
  attendees: EventAttendeeInfo[];
}

export interface EventAttendeeInfo {
  userId: string;
  name: string;
  avatarUrl?: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "MAYBE";
}

export type EventCategory =
  | "GENERAL"
  | "FAMILY_TIME"
  | "OUTDOOR"
  | "DINING"
  | "MOVIE_NIGHT"
  | "GAME_NIGHT"
  | "ADVENTURE"
  | "SPORTS"
  | "CRAFTS"
  | "HOLIDAY"
  | "BIRTHDAY"
  | "TRAVEL"
  | "APPOINTMENT";

export interface OnboardingSurvey {
  interests: string[];
  currentActivities: string[];
  goals: string[];
  wantRecommendations: boolean;
  activityTypes: string[];
  maxTravelDistance?: number;
  address?: string;
  preferredBudget?: string;
  helpCountryPreference: string[];
}

export interface ActivityRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  cost?: string;
  duration?: string;
  isIndoor: boolean;
  isOutdoor: boolean;
  tags: string[];
  rating?: number;
  reviewCount?: number;
  sourceUrl?: string;
  isAffiliate: boolean;
}

export interface ChatMessageData {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  content: string;
  isAI: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationData {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

export interface SubscriptionInfo {
  plan: "FREE" | "FAMILY" | "FAMILY_PLUS";
  status: "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED";
  trialEndsAt?: string;
  currentPeriodEnd?: string;
}
