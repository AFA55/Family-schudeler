import { create } from "zustand";
import type { NotificationData } from "@familysync/shared";
import { notificationAPI } from "../lib/api";

interface NotificationState {
  notifications: NotificationData[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: (userId: string, unreadOnly?: boolean) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (userId, unreadOnly = true) => {
    set({ isLoading: true });
    try {
      const response = await notificationAPI.list(userId, unreadOnly);
      const notifications: NotificationData[] =
        response.data.notifications ?? response.data;
      const unreadCount = notifications.filter((n) => !n.read).length;
      set({ notifications, unreadCount, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await notificationAPI.markRead(notificationId);
      set((state) => {
        const updated = state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        return {
          notifications: updated,
          unreadCount: updated.filter((n) => !n.read).length,
        };
      });
    } catch (error) {
      throw error;
    }
  },

  markAllAsRead: async (userId) => {
    try {
      await notificationAPI.markAllRead(userId);
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      throw error;
    }
  },
}));
