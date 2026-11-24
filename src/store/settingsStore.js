import { create } from 'zustand';
import { useProjectStore } from './projectStore';
import { useTaskStore } from './taskStore';
import { useTeamStore } from './teamStore';
import { useTimeStore } from './timeStore';
import { useCalendarStore } from './calendarStore';
import { useMessageStore } from './messageStore';
import { useNotificationStore } from './notificationStore';

const STORAGE_SETTINGS_KEY = 'tasksphere_settings';

const defaultSettings = {
  workspace: {
    name: 'TASKSPHERE HQ',
    description: 'Enterprise agile software delivery and multi-disciplinary product engineering workspace.',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&q=80',
    timezone: 'America/New_York (UTC-5)',
    dateFormat: 'MMM d, yyyy',
    currency: 'USD ($)',
    plan: 'Enterprise Tier',
    createdAt: '2025-01-01'
  },
  preferences: {
    theme: 'light',
    sidebarCollapsed: false,
    soundNotifications: true,
    emailDigest: true,
    defaultProjectView: 'grid', // 'grid' or 'list'
    compactTasks: false
  }
};

const getInitialSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return defaultSettings;
};

export const useSettingsStore = create((set, get) => ({
  ...getInitialSettings(),

  updateWorkspace: (updates) => {
    set(state => {
      const next = { ...state, workspace: { ...state.workspace, ...updates } };
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  },

  updatePreferences: (updates) => {
    set(state => {
      const next = { ...state, preferences: { ...state.preferences, ...updates } };
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  },

  toggleSidebar: () => {
    set(state => {
      const collapsed = !state.preferences.sidebarCollapsed;
      const next = {
        ...state,
        preferences: { ...state.preferences, sidebarCollapsed: collapsed }
      };
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  },

  toggleTheme: () => {
    set(state => {
      const nextTheme = state.preferences.theme === 'light' ? 'dark' : 'light';
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      const next = {
        ...state,
        preferences: { ...state.preferences, theme: nextTheme }
      };
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  },

  resetAllDemoData: () => {
    useProjectStore.getState().resetProjects();
    useTaskStore.getState().resetTasks();
    useTeamStore.getState().resetTeam();
    useTimeStore.getState().resetTime();
    useCalendarStore.getState().resetCalendar();
    useMessageStore.getState().resetMessages();
    useNotificationStore.getState().resetNotifications();

    set(defaultSettings);
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(defaultSettings));
  },

  exportAllDataJSON: () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      workspace: get().workspace,
      preferences: get().preferences,
      projects: useProjectStore.getState().projects,
      tasks: useTaskStore.getState().tasks,
      team: useTeamStore.getState().members,
      timeEntries: useTimeStore.getState().entries,
      calendar: useCalendarStore.getState().events,
      discussions: useMessageStore.getState().discussions
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tasksphere-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}));
