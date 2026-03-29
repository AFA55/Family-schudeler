import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  // Token will be added from secure store
  return config;
});

// API methods
export const authAPI = {
  signUp: (data: { email: string; name: string; password: string }) =>
    api.post("/auth/signup", data),
  signIn: (data: { email: string; password: string }) =>
    api.post("/auth/signin", data),
};

export const familyAPI = {
  list: () => api.get("/families"),
  create: (data: { name: string; color: string }) =>
    api.post("/families", data),
  addMember: (familyId: string, data: { email: string; name: string; role: string }) =>
    api.post(`/families/${familyId}/members`, data),
  join: (inviteCode: string) =>
    api.post(`/families/join/${inviteCode}`),
};

export const eventAPI = {
  list: (familyId: string, startDate: string, endDate: string) =>
    api.get(`/events?familyId=${familyId}&start=${startDate}&end=${endDate}`),
  create: (data: Record<string, unknown>) =>
    api.post("/events", data),
  update: (eventId: string, data: Record<string, unknown>) =>
    api.put(`/events/${eventId}`, data),
  delete: (eventId: string) =>
    api.delete(`/events/${eventId}`),
  rsvp: (eventId: string, status: string) =>
    api.post(`/events/${eventId}/rsvp`, { status }),
};

export const onboardingAPI = {
  submit: (data: Record<string, unknown>) =>
    api.post("/onboarding", data),
};

export const recommendationAPI = {
  getActivities: (params: Record<string, unknown>) =>
    api.get("/recommendations/activities", { params }),
  getNearby: (lat: number, lng: number, category: string) =>
    api.get(`/recommendations/nearby?lat=${lat}&lng=${lng}&category=${category}`),
};
