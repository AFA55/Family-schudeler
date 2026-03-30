import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../lib/api";

const TOKEN_KEY = "familysync_auth_token";
const USER_KEY = "familysync_auth_user";

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
  signUp: (data: {
    email: string;
    name: string;
    password: string;
  }) => Promise<void>;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isOnboarded: false,

  setUser: (user) => set({ user, isLoading: false }),
  setToken: (token) => set({ token }),
  setOnboarded: (isOnboarded) => set({ isOnboarded }),

  logout: () => {
    AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    set({ user: null, token: null, isOnboarded: false });
  },

  signUp: async (data) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.signUp(data);
      const { token, user } = response.data;
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ token, user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signIn: async (data) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.signIn(data);
      const { token, user } = response.data;
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ token, user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loadToken: async () => {
    try {
      const [token, userJson] = await AsyncStorage.multiGet([
        TOKEN_KEY,
        USER_KEY,
      ]);
      const savedToken = token[1];
      const savedUser = userJson[1];
      if (savedToken && savedUser) {
        set({
          token: savedToken,
          user: JSON.parse(savedUser) as User,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
