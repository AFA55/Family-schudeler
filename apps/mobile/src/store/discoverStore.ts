import { create } from "zustand";
import type { ActivityRecommendation } from "@familysync/shared";
import { discoverAPI } from "../lib/api";

interface DiscoverItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  source: string;
  url?: string;
  city: string;
  state: string;
  likes: number;
}

interface DiscoverState {
  trending: DiscoverItem[];
  activities: ActivityRecommendation[];
  selectedCategory: string;
  isLoading: boolean;
  fetchFeed: (params: {
    city?: string;
    state?: string;
    lat?: number;
    lng?: number;
    category?: string;
  }) => Promise<void>;
  submitSocialLink: (
    url: string,
    city: string,
    state: string
  ) => Promise<void>;
  setSelectedCategory: (category: string) => void;
}

export const useDiscoverStore = create<DiscoverState>((set) => ({
  trending: [],
  activities: [],
  selectedCategory: "",
  isLoading: false,

  fetchFeed: async (params) => {
    set({ isLoading: true });
    try {
      const response = await discoverAPI.feed(params);
      const { trending, activities } = response.data;
      set({
        trending: trending ?? [],
        activities: activities ?? [],
        selectedCategory: params.category ?? "",
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  submitSocialLink: async (url, city, state) => {
    try {
      await discoverAPI.submit({ url, city, state });
    } catch (error) {
      throw error;
    }
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
