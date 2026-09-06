import { create } from "zustand";

interface OnboardingData {
  interests: string[];
  goals: string[];
  activityTypes: string[];
  preferredBudget: string | null;
  wantRecommendations: boolean;
  address: string;
  maxTravelDistance: number;
  helpCountryPreference: string[];
}

interface OnboardingState extends OnboardingData {
  setInterests: (interests: string[]) => void;
  setGoals: (goals: string[]) => void;
  setActivities: (data: {
    activityTypes: string[];
    preferredBudget: string | null;
    wantRecommendations: boolean;
  }) => void;
  setLocation: (data: { address: string; maxTravelDistance: number }) => void;
  setCharity: (helpCountryPreference: string[]) => void;
  getSubmitData: () => OnboardingData;
  reset: () => void;
}

const initialState: OnboardingData = {
  interests: [],
  goals: [],
  activityTypes: [],
  preferredBudget: null,
  wantRecommendations: true,
  address: "",
  maxTravelDistance: 25,
  helpCountryPreference: [],
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,

  setInterests: (interests) => set({ interests }),
  setGoals: (goals) => set({ goals }),
  setActivities: ({ activityTypes, preferredBudget, wantRecommendations }) =>
    set({ activityTypes, preferredBudget, wantRecommendations }),
  setLocation: ({ address, maxTravelDistance }) =>
    set({ address, maxTravelDistance }),
  setCharity: (helpCountryPreference) => set({ helpCountryPreference }),

  getSubmitData: () => {
    const state = get();
    return {
      interests: state.interests,
      goals: state.goals,
      activityTypes: state.activityTypes,
      preferredBudget: state.preferredBudget,
      wantRecommendations: state.wantRecommendations,
      address: state.address,
      maxTravelDistance: state.maxTravelDistance,
      helpCountryPreference: state.helpCountryPreference,
    };
  },

  reset: () => set(initialState),
}));
