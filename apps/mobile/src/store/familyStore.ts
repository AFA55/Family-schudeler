import { create } from "zustand";
import type { FamilyInfo, CalendarEvent } from "@familysync/shared";
import { familyAPI, eventAPI } from "../lib/api";

interface FamilyState {
  families: FamilyInfo[];
  activeFamily: FamilyInfo | null;
  events: CalendarEvent[];
  selectedDate: string;
  isLoading: boolean;
  setFamilies: (families: FamilyInfo[]) => void;
  setActiveFamily: (family: FamilyInfo | null) => void;
  setEvents: (events: CalendarEvent[]) => void;
  setSelectedDate: (date: string) => void;
  addEvent: (event: CalendarEvent) => void;
  removeEvent: (eventId: string) => void;
  fetchFamilies: (userId: string) => Promise<void>;
  createFamily: (
    name: string,
    color: string,
    userId: string
  ) => Promise<FamilyInfo>;
  fetchEvents: (
    familyId: string,
    startDate: string,
    endDate: string
  ) => Promise<void>;
  createEvent: (eventData: {
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
  }) => Promise<CalendarEvent>;
}

export const useFamilyStore = create<FamilyState>((set, get) => ({
  families: [],
  activeFamily: null,
  events: [],
  selectedDate: new Date().toISOString().split("T")[0],
  isLoading: false,

  setFamilies: (families) => set({ families }),
  setActiveFamily: (activeFamily) => set({ activeFamily }),
  setEvents: (events) => set({ events }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),
  removeEvent: (eventId) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== eventId),
    })),

  fetchFamilies: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await familyAPI.list(userId);
      const families: FamilyInfo[] = response.data.families ?? response.data;
      set({
        families,
        activeFamily: get().activeFamily ?? families[0] ?? null,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createFamily: async (name, color, userId) => {
    set({ isLoading: true });
    try {
      const response = await familyAPI.create({ name, color, userId });
      const family: FamilyInfo = response.data.family ?? response.data;
      set((state) => ({
        families: [...state.families, family],
        activeFamily: state.activeFamily ?? family,
        isLoading: false,
      }));
      return family;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchEvents: async (familyId, startDate, endDate) => {
    set({ isLoading: true });
    try {
      const response = await eventAPI.list(familyId, startDate, endDate);
      const events: CalendarEvent[] = response.data.events ?? response.data;
      set({ events, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createEvent: async (eventData) => {
    set({ isLoading: true });
    try {
      const response = await eventAPI.create(eventData);
      const event: CalendarEvent = response.data.event ?? response.data;
      set((state) => ({
        events: [...state.events, event],
        isLoading: false,
      }));
      return event;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
