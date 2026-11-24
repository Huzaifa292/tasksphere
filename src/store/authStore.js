import { create } from 'zustand';
import { demoUsers } from '../data/demoUsers';

const STORAGE_KEY = 'tasksphere_auth';

const getInitialAuth = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return {
    isAuthenticated: true,
    user: demoUsers[0], // default to Admin
    rememberSession: true
  };
};

export const useAuthStore = create((set, get) => ({
  ...getInitialAuth(),

  login: (email, password, remember = true) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check admin
    if (trimmedEmail === 'admin@tasksphere.demo' && password === 'TaskSphere123!') {
      const user = demoUsers.find(u => u.email === 'admin@tasksphere.demo') || demoUsers[0];
      const state = { isAuthenticated: true, user, rememberSession: remember };
      set(state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return { success: true };
    }

    // Check member
    if (trimmedEmail === 'member@tasksphere.demo' && password === 'Member123!') {
      const user = demoUsers.find(u => u.email === 'member@tasksphere.demo') || demoUsers[1];
      const state = { isAuthenticated: true, user, rememberSession: remember };
      set(state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return { success: true };
    }

    // General demo match for any team member
    const existing = demoUsers.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing && (password === 'TaskSphere123!' || password === 'Demo123!' || password.length >= 6)) {
      const state = { isAuthenticated: true, user: existing, rememberSession: remember };
      set(state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password. Use demo credentials.' };
  },

  register: (name, email, password, jobTitle = 'Software Engineer') => {
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: email.trim().toLowerCase(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80`,
      role: 'Team Member',
      jobTitle,
      department: 'Engineering',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      bio: 'New team member on TaskSphere SaaS.',
      location: 'Remote',
      timezone: 'UTC'
    };

    const state = { isAuthenticated: true, user: newUser, rememberSession: true };
    set(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { success: true, user: newUser };
  },

  logout: () => {
    const state = { isAuthenticated: false, user: null, rememberSession: false };
    set(state);
    localStorage.removeItem(STORAGE_KEY);
  },

  switchUser: (userId) => {
    const target = demoUsers.find(u => u.id === userId) || demoUsers[0];
    const state = { isAuthenticated: true, user: target, rememberSession: true };
    set(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  updateProfile: (updates) => {
    set(state => {
      const updatedUser = { ...state.user, ...updates };
      const nextState = { ...state, user: updatedUser };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      return nextState;
    });
  }
}));
