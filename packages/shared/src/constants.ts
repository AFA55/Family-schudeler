// ============================================
// App Constants
// ============================================

export const APP_NAME = "FamilySync";
export const APP_TAGLINE = "Quality family time, effortlessly planned.";
export const APP_DESCRIPTION =
  "Smart scheduling for busy families. Plan activities, discover experiences, and make every moment count — together.";

// Charity
export const CHARITY_PERCENTAGE = 87; // % of profit
export const CHARITY_MESSAGE =
  "87% of our profits help families in need around the world.";

// Trial
export const TRIAL_DAYS = 14;

// Pricing
export const PRICING = {
  FREE: { monthly: 0, annual: 0, name: "Free" },
  PLUS: { monthly: 4.99, annual: 39.99, name: "Plus" },
  PREMIUM: { monthly: 7.99, annual: 59.99, name: "Premium" },
} as const;

// Color Palette - Warm, family-friendly, modern
export const COLORS = {
  // Primary - Warm Indigo
  primary: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
  },
  // Secondary - Warm Coral/Salmon
  secondary: {
    50: "#FFF5F5",
    100: "#FFE3E3",
    200: "#FFC9C9",
    300: "#FFA8A8",
    400: "#FF8787",
    500: "#FF6B6B",
    600: "#FA5252",
    700: "#F03E3E",
    800: "#E03131",
    900: "#C92A2A",
  },
  // Accent - Warm Amber
  accent: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
  },
  // Success - Soft Green
  success: {
    50: "#ECFDF5",
    400: "#34D399",
    500: "#10B981",
    600: "#059669",
  },
  // Neutrals
  neutral: {
    50: "#FAFAFA",
    100: "#F5F5F4",
    200: "#E7E5E4",
    300: "#D6D3D1",
    400: "#A8A29E",
    500: "#78716C",
    600: "#57534E",
    700: "#44403C",
    800: "#292524",
    900: "#1C1917",
  },
  // Background
  background: "#FEFDFB",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFE",
} as const;

// Family member color assignments
export const FAMILY_COLORS = [
  "#6366F1", // Indigo
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#FF6B6B", // Coral
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#84CC16", // Lime
] as const;

// Event categories with icons and colors
export const EVENT_CATEGORIES = {
  GENERAL: { label: "General", icon: "calendar", color: "#6366F1" },
  FAMILY_TIME: { label: "Family Time", icon: "heart", color: "#FF6B6B" },
  OUTDOOR: { label: "Outdoor", icon: "sun", color: "#10B981" },
  DINING: { label: "Dining Out", icon: "utensils", color: "#F59E0B" },
  MOVIE_NIGHT: { label: "Movie Night", icon: "film", color: "#8B5CF6" },
  GAME_NIGHT: { label: "Game Night", icon: "gamepad-2", color: "#06B6D4" },
  ADVENTURE: { label: "Adventure", icon: "mountain", color: "#059669" },
  SPORTS: { label: "Sports", icon: "trophy", color: "#EA580C" },
  CRAFTS: { label: "Crafts", icon: "scissors", color: "#EC4899" },
  HOLIDAY: { label: "Holiday", icon: "gift", color: "#DC2626" },
  BIRTHDAY: { label: "Birthday", icon: "cake", color: "#D946EF" },
  TRAVEL: { label: "Travel", icon: "plane", color: "#0284C7" },
  APPOINTMENT: { label: "Appointment", icon: "clock", color: "#78716C" },
} as const;

// Onboarding options
export const INTEREST_OPTIONS = [
  "Hiking & Nature",
  "Board Games",
  "Cooking Together",
  "Movie Nights",
  "Arts & Crafts",
  "Sports & Fitness",
  "Dining Out",
  "Travel & Road Trips",
  "Camping",
  "Gardening",
  "Music & Concerts",
  "Museums & Culture",
  "Beach & Water Activities",
  "Volunteering",
  "Reading & Book Club",
  "Photography",
] as const;

export const GOAL_OPTIONS = [
  "More quality family time",
  "Be more organized",
  "Find new activities to do together",
  "Better coordinate busy schedules",
  "Create lasting family traditions",
  "Reduce screen time",
  "Explore our local area",
  "Save money on activities",
] as const;

export const ACTIVITY_TYPE_OPTIONS = [
  "At-home activities",
  "Outdoor adventures",
  "Dining & restaurants",
  "Day trips",
  "Weekend getaways",
  "Free activities",
  "Educational activities",
  "Seasonal events",
] as const;

export const BUDGET_OPTIONS = [
  { value: "free", label: "Free only" },
  { value: "budget", label: "Budget-friendly (under $25)" },
  { value: "moderate", label: "Moderate ($25-$75)" },
  { value: "any", label: "Any budget" },
] as const;

export const HELP_COUNTRY_OPTIONS = [
  { value: "US", label: "Families in the US" },
  { value: "GLOBAL", label: "Families worldwide" },
  { value: "AFRICA", label: "Families in Africa" },
  { value: "ASIA", label: "Families in Asia" },
  { value: "LATIN_AMERICA", label: "Families in Latin America" },
  { value: "MIDDLE_EAST", label: "Families in the Middle East" },
] as const;
