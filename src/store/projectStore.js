import { create } from 'zustand';
import { demoProjects } from '../data/demoProjects';
import { useTaskStore } from './taskStore';
import { useNotificationStore } from './notificationStore';

const STORAGE_KEY = 'tasksphere_projects';

const getInitialProjects = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return demoProjects;
};

export const useProjectStore = create((set, get) => ({
  projects: getInitialProjects(),

  addProject: (newProjectData) => {
    const id = `proj-${Date.now()}`;
    const newProject = {
      id,
      progress: 0,
      createdAt: new Date().toISOString(),
      status: 'Active',
      priority: 'Medium',
      members: ['user-admin'],
      tags: [],
      ...newProjectData
    };

    set(state => {
      const nextProjects = [newProject, ...state.projects];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProjects));
      return { projects: nextProjects };
    });

    // Notify
    useNotificationStore.getState().addNotification({
      type: 'Project Updated',
      title: 'Project Created',
      message: `Project "${newProject.name}" has been created successfully.`,
      projectId: id
    });

    return newProject;
  },

  updateProject: (id, updates) => {
    set(state => {
      const nextProjects = state.projects.map(p => {
        if (p.id === id) {
          return { ...p, ...updates };
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProjects));
      return { projects: nextProjects };
    });

    useNotificationStore.getState().addNotification({
      type: 'Project Updated',
      title: 'Project Updated',
      message: `Project settings have been updated.`,
      projectId: id
    });
  },

  deleteProject: (id) => {
    set(state => {
      const nextProjects = state.projects.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProjects));
      return { projects: nextProjects };
    });

    // Cascade delete project tasks
    useTaskStore.getState().deleteTasksByProject(id);
  },

  archiveProject: (id) => {
    get().updateProject(id, { status: 'Archived' });
  },

  duplicateProject: (id) => {
    const project = get().projects.find(p => p.id === id);
    if (!project) return;
    const duplicated = {
      ...project,
      id: `proj-${Date.now()}`,
      name: `${project.name} (Copy)`,
      createdAt: new Date().toISOString()
    };

    set(state => {
      const nextProjects = [duplicated, ...state.projects];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProjects));
      return { projects: nextProjects };
    });

    return duplicated;
  },

  resetProjects: () => {
    set({ projects: demoProjects });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoProjects));
  }
}));
