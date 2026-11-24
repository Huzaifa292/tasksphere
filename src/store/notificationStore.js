import { create } from 'zustand';
import { demoNotifications } from '../data/demoNotifications';

const STORAGE_KEY = 'tasksphere_notifications';

const getInitialNotifications = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return demoNotifications;
};

export const useNotificationStore = create((set, get) => ({
  notifications: getInitialNotifications(),

  addNotification: (notifData) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
      userId: 'user-admin',
      actorId: 'system',
      ...notifData
    };

    set(state => {
      const next = [newNotif, ...state.notifications];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { notifications: next };
    });
    return newNotif;
  },

  markAsRead: (id) => {
    set(state => {
      const next = state.notifications.map(n => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { notifications: next };
    });
  },

  markAllAsRead: () => {
    set(state => {
      const next = state.notifications.map(n => ({ ...n, read: true }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { notifications: next };
    });
  },

  deleteNotification: (id) => {
    set(state => {
      const next = state.notifications.filter(n => n.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { notifications: next };
    });
  },

  resetNotifications: () => {
    set({ notifications: demoNotifications });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoNotifications));
  }
}));
