import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth token interceptor - reads token from auth store
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auth ----
export const authAPI = {
  signUp: (data: { email: string; name: string; password: string }) =>
    api.post("/auth/signup", data),
  signIn: (data: { email: string; password: string }) =>
    api.post("/auth/callback/credentials", data),
};

// ---- Families ----
export const familyAPI = {
  list: (userId: string) => api.get(`/families?userId=${userId}`),
  create: (data: { name: string; color: string; userId: string }) =>
    api.post("/families", data),
  get: (familyId: string) => api.get(`/families/${familyId}`),
  addMember: (
    familyId: string,
    data: { email: string; name: string; role: string }
  ) => api.post(`/families/${familyId}/members`, data),
  join: (inviteCode: string, userId: string) =>
    api.post(`/families/join/${inviteCode}`, { userId }),
};

// ---- Events ----
export const eventAPI = {
  list: (familyId: string, startDate: string, endDate: string) =>
    api.get(
      `/events?familyId=${familyId}&start=${startDate}&end=${endDate}`
    ),
  get: (eventId: string) => api.get(`/events/${eventId}`),
  create: (data: {
    familyId: string;
    creatorId: string;
    title: string;
    startTime: string;
    endTime: string;
    category: string;
    attendeeIds?: string[];
    description?: string;
    location?: string;
    allDay?: boolean;
    cost?: string;
  }) => api.post("/events", data),
  update: (eventId: string, data: Record<string, unknown>) =>
    api.put(`/events/${eventId}`, data),
  delete: (eventId: string) => api.delete(`/events/${eventId}`),
  rsvp: (eventId: string, data: { userId: string; status: string }) =>
    api.post(`/events/${eventId}/rsvp`, data),
};

// ---- Onboarding ----
export const onboardingAPI = {
  submit: (data: {
    userId: string;
    interests: string[];
    goals: string[];
    activityTypes: string[];
    [key: string]: unknown;
  }) => api.post("/onboarding", data),
  get: (userId: string) => api.get(`/onboarding?userId=${userId}`),
};

// ---- Notifications ----
export const notificationAPI = {
  list: (userId: string, unreadOnly = true) =>
    api.get(
      `/notifications?userId=${userId}&unreadOnly=${unreadOnly}`
    ),
  markRead: (notificationId: string) =>
    api.put(`/notifications/${notificationId}/read`),
  markAllRead: (userId: string) =>
    api.put(`/notifications/mark-all-read?userId=${userId}`),
};

// ---- Discover ----
export const discoverAPI = {
  feed: (params: {
    city?: string;
    state?: string;
    lat?: number;
    lng?: number;
    category?: string;
  }) => api.get("/discover", { params }),
  submit: (data: { url: string; city: string; state: string }) =>
    api.post("/discover", data),
};

// ---- Subscription ----
export const subscriptionAPI = {
  status: (userId: string) =>
    api.get(`/stripe/subscription?userId=${userId}`),
  checkout: (data: { userId: string; plan: string; interval: string }) =>
    api.post("/stripe/checkout", data),
};

// ---- Chat ----
export const chatAPI = {
  getRooms: (userId: string) =>
    api.get(`/chat/rooms?userId=${userId}`),
  createRoom: (familyId: string, userId: string, name?: string) =>
    api.post("/chat/rooms", { familyId, userId, name }),
  getMessages: (roomId: string, userId: string, cursor?: string) => {
    const params = new URLSearchParams({ userId });
    if (cursor) params.set("cursor", cursor);
    return api.get(`/chat/rooms/${roomId}/messages?${params.toString()}`);
  },
  sendMessage: (roomId: string, userId: string, content: string) =>
    api.post(`/chat/rooms/${roomId}/messages`, { content, userId }),
  askAI: (
    message: string,
    familyId: string,
    userId: string,
    roomId?: string
  ) =>
    api.post("/chat/ai", { message, familyId, userId, roomId }),
};
