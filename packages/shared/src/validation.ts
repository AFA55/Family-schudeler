import { z } from "zod";

// ============================================
// Validation Schemas (shared between web & mobile)
// ============================================

export const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const createFamilySchema = z.object({
  name: z.string().min(1, "Family name is required").max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color"),
});

export const addFamilyMemberSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "MEMBER", "CHILD", "GUEST"]),
});

export const createEventSchema = z.object({
  familyId: z.string().min(1),
  title: z.string().min(1, "Event title is required").max(100),
  description: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  allDay: z.boolean().default(false),
  category: z.enum([
    "GENERAL",
    "FAMILY_TIME",
    "OUTDOOR",
    "DINING",
    "MOVIE_NIGHT",
    "GAME_NIGHT",
    "ADVENTURE",
    "SPORTS",
    "CRAFTS",
    "HOLIDAY",
    "BIRTHDAY",
    "TRAVEL",
    "APPOINTMENT",
  ]),
  reminderMinutes: z.number().min(0).default(30),
  attendeeIds: z.array(z.string()).optional(),
});

export const onboardingSchema = z.object({
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  currentActivities: z.array(z.string()),
  goals: z.array(z.string()).min(1, "Select at least one goal"),
  wantRecommendations: z.boolean(),
  activityTypes: z.array(z.string()),
  maxTravelDistance: z.number().min(1).max(500).optional(),
  address: z.string().optional(),
  preferredBudget: z.string().optional(),
  helpCountryPreference: z.array(z.string()),
});

export const chatMessageSchema = z.object({
  chatRoomId: z.string().min(1),
  content: z.string().min(1).max(2000),
});

// Type exports from schemas
export type SignUpInput = z.infer<typeof signUpSchema>;
export type CreateFamilyInput = z.infer<typeof createFamilySchema>;
export type AddFamilyMemberInput = z.infer<typeof addFamilyMemberSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
