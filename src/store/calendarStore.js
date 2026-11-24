import { create } from 'zustand';
import { demoEvents } from '../data/demoEvents';

const STORAGE_KEY = 'tasksphere_calendar';

const getInitialEvents = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return demoEvents;
};

export const useCalendarStore = create((set, get) => ({
  events: getInitialEvents(),

  addEvent: (eventData) => {
    const newEvent = {
      id: `evt-${Date.now()}`,
      color: '#7867F7',
      attendees: ['user-admin'],
      ...eventData
    };
    set(state => {
      const next = [...state.events, newEvent];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { events: next };
    });
    return newEvent;
  },

  updateEvent: (id, updates) => {
    set(state => {
      const next = state.events.map(evt => (evt.id === id ? { ...evt, ...updates } : evt));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { events: next };
    });
  },

  deleteEvent: (id) => {
    set(state => {
      const next = state.events.filter(evt => evt.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { events: next };
    });
  },

  resetCalendar: () => {
    set({ events: demoEvents });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoEvents));
  }
}));
