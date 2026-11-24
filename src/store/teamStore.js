import { create } from 'zustand';
import { demoUsers } from '../data/demoUsers';
import { useNotificationStore } from './notificationStore';

const STORAGE_KEY = 'tasksphere_team';

const getInitialTeam = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return demoUsers;
};

export const useTeamStore = create((set, get) => ({
  members: getInitialTeam(),

  addMember: (memberData) => {
    const id = `user-${Date.now()}`;
    const newMember = {
      id,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      role: 'Team Member',
      department: 'Engineering',
      ...memberData
    };

    set(state => {
      const next = [...state.members, newMember];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { members: next };
    });

    useNotificationStore.getState().addNotification({
      type: 'Team Member Added',
      title: 'Member Added',
      message: `${newMember.name} joined the workspace.`
    });

    return newMember;
  },

  updateMember: (id, updates) => {
    set(state => {
      const next = state.members.map(m => (m.id === id ? { ...m, ...updates } : m));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { members: next };
    });
  },

  removeMember: (id) => {
    set(state => {
      const next = state.members.filter(m => m.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { members: next };
    });
  },

  resetTeam: () => {
    set({ members: demoUsers });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUsers));
  }
}));
