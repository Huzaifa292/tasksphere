import { create } from 'zustand';
import { demoTimeEntries } from '../data/demoTimeEntries';

const STORAGE_ENTRIES_KEY = 'tasksphere_time_entries';
const STORAGE_TIMER_KEY = 'tasksphere_active_timer';

const getInitialEntries = () => {
  try {
    const saved = localStorage.getItem(STORAGE_ENTRIES_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return demoTimeEntries;
};

const getInitialTimer = () => {
  try {
    const saved = localStorage.getItem(STORAGE_TIMER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return {
    isRunning: false,
    startTimestamp: null,
    accumulatedSeconds: 0,
    projectId: 'proj-1',
    taskId: 'task-104',
    description: 'Working on Kanban interactions'
  };
};

export const useTimeStore = create((set, get) => ({
  entries: getInitialEntries(),
  activeTimer: getInitialTimer(),

  // Get current real-time elapsed seconds
  getElapsedSeconds: () => {
    const { activeTimer } = get();
    if (!activeTimer) return 0;
    if (!activeTimer.isRunning || !activeTimer.startTimestamp) {
      return activeTimer.accumulatedSeconds || 0;
    }
    const currentRun = Math.floor((Date.now() - activeTimer.startTimestamp) / 1000);
    return (activeTimer.accumulatedSeconds || 0) + currentRun;
  },

  startTimer: (projectId, taskId, description = '') => {
    set(state => {
      const now = Date.now();
      const updatedTimer = {
        isRunning: true,
        startTimestamp: now,
        accumulatedSeconds: state.activeTimer?.isRunning ? state.activeTimer.accumulatedSeconds : (state.activeTimer?.accumulatedSeconds || 0),
        projectId: projectId || state.activeTimer?.projectId || 'proj-1',
        taskId: taskId || state.activeTimer?.taskId || '',
        description: description || state.activeTimer?.description || 'Active task session'
      };
      localStorage.setItem(STORAGE_TIMER_KEY, JSON.stringify(updatedTimer));
      return { activeTimer: updatedTimer };
    });
  },

  pauseTimer: () => {
    set(state => {
      if (!state.activeTimer.isRunning) return {};
      const currentRun = Math.floor((Date.now() - state.activeTimer.startTimestamp) / 1000);
      const updatedTimer = {
        ...state.activeTimer,
        isRunning: false,
        startTimestamp: null,
        accumulatedSeconds: (state.activeTimer.accumulatedSeconds || 0) + currentRun
      };
      localStorage.setItem(STORAGE_TIMER_KEY, JSON.stringify(updatedTimer));
      return { activeTimer: updatedTimer };
    });
  },

  stopTimer: (userId = 'user-admin') => {
    const totalElapsed = get().getElapsedSeconds();
    const { activeTimer } = get();

    if (totalElapsed > 5 && activeTimer.projectId) {
      // Record time entry
      const newEntry = {
        id: `time-${Date.now()}`,
        projectId: activeTimer.projectId,
        taskId: activeTimer.taskId || null,
        userId,
        description: activeTimer.description || 'Sprint task development',
        date: new Date().toISOString().split('T')[0],
        durationSeconds: totalElapsed,
        billable: true,
        createdAt: new Date().toISOString()
      };

      set(state => {
        const nextEntries = [newEntry, ...state.entries];
        const resetTimer = {
          isRunning: false,
          startTimestamp: null,
          accumulatedSeconds: 0,
          projectId: 'proj-1',
          taskId: '',
          description: ''
        };
        localStorage.setItem(STORAGE_ENTRIES_KEY, JSON.stringify(nextEntries));
        localStorage.setItem(STORAGE_TIMER_KEY, JSON.stringify(resetTimer));
        return { entries: nextEntries, activeTimer: resetTimer };
      });
      return newEntry;
    } else {
      // Just reset
      const resetTimer = {
        isRunning: false,
        startTimestamp: null,
        accumulatedSeconds: 0,
        projectId: 'proj-1',
        taskId: '',
        description: ''
      };
      localStorage.setItem(STORAGE_TIMER_KEY, JSON.stringify(resetTimer));
      set({ activeTimer: resetTimer });
      return null;
    }
  },

  updateTimerMeta: (updates) => {
    set(state => {
      const updatedTimer = { ...state.activeTimer, ...updates };
      localStorage.setItem(STORAGE_TIMER_KEY, JSON.stringify(updatedTimer));
      return { activeTimer: updatedTimer };
    });
  },

  addTimeEntry: (entryData) => {
    const newEntry = {
      id: `time-${Date.now()}`,
      createdAt: new Date().toISOString(),
      billable: true,
      ...entryData
    };
    set(state => {
      const next = [newEntry, ...state.entries];
      localStorage.setItem(STORAGE_ENTRIES_KEY, JSON.stringify(next));
      return { entries: next };
    });
    return newEntry;
  },

  deleteTimeEntry: (id) => {
    set(state => {
      const next = state.entries.filter(e => e.id !== id);
      localStorage.setItem(STORAGE_ENTRIES_KEY, JSON.stringify(next));
      return { entries: next };
    });
  },

  resetTime: () => {
    set({ entries: demoTimeEntries });
    localStorage.setItem(STORAGE_ENTRIES_KEY, JSON.stringify(demoTimeEntries));
  }
}));
