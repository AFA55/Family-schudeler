import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isOnboarded: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setOnboarded: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isOnboarded: false,
  setUser: (user) => set({ user, isLoading: false }),
  setToken: (token) => set({ token }),
  setOnboarded: (isOnboarded) => set({ isOnboarded }),
  logout: () => set({ user: null, token: null, isOnboarded: false }),
}));
