import { create } from "zustand";
import type { FamilyInfo, CalendarEvent } from "@familysync/shared";

interface FamilyState {
  families: FamilyInfo[];
  activeFamily: FamilyInfo | null;
  events: CalendarEvent[];
  selectedDate: string;
  setFamilies: (families: FamilyInfo[]) => void;
  setActiveFamily: (family: FamilyInfo | null) => void;
  setEvents: (events: CalendarEvent[]) => void;
  setSelectedDate: (date: string) => void;
  addEvent: (event: CalendarEvent) => void;
  removeEvent: (eventId: string) => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  families: [],
  activeFamily: null,
  events: [],
  selectedDate: new Date().toISOString().split("T")[0],
  setFamilies: (families) => set({ families }),
  setActiveFamily: (activeFamily) => set({ activeFamily }),
  setEvents: (events) => set({ events }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  removeEvent: (eventId) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== eventId),
    })),
}));
