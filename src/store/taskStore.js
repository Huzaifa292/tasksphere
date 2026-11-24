import { create } from 'zustand';
import { demoTasks } from '../data/demoTasks';
import { useNotificationStore } from './notificationStore';

const STORAGE_KEY = 'tasksphere_tasks';

const getInitialTasks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return demoTasks;
};

export const useTaskStore = create((set, get) => ({
  tasks: getInitialTasks(),

  addTask: (taskData) => {
    const id = `task-${Date.now()}`;
    const newTask = {
      id,
      subtasks: [],
      comments: [],
      actualHours: 0,
      status: 'To Do',
      priority: 'Medium',
      createdAt: new Date().toISOString(),
      ...taskData
    };

    set(state => {
      const next = [newTask, ...state.tasks];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { tasks: next };
    });

    // Trigger notification if assigned
    if (newTask.assigneeId) {
      useNotificationStore.getState().addNotification({
        type: 'Task Assigned',
        title: 'New Task Assigned',
        message: `You were assigned to "${newTask.title}".`,
        taskId: id,
        projectId: newTask.projectId,
        userId: newTask.assigneeId
      });
    }

    return newTask;
  },

  updateTask: (id, updates) => {
    set(state => {
      const next = state.tasks.map(t => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          // If status transitioned to Done
          if (updates.status === 'Done' && t.status !== 'Done') {
            useNotificationStore.getState().addNotification({
              type: 'Task Completed',
              title: 'Task Completed',
              message: `Task "${t.title}" was marked as completed.`,
              taskId: id,
              projectId: t.projectId
            });
          }
          return updated;
        }
        return t;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { tasks: next };
    });
  },

  updateTaskStatus: (id, newStatus) => {
    get().updateTask(id, { status: newStatus });
  },

  deleteTask: (id) => {
    set(state => {
      const next = state.tasks.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { tasks: next };
    });
  },

  deleteTasksByProject: (projectId) => {
    set(state => {
      const next = state.tasks.filter(t => t.projectId !== projectId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { tasks: next };
    });
  },

  duplicateTask: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    const duplicated = {
      ...task,
      id: `task-${Date.now()}`,
      title: `${task.title} (Copy)`,
      createdAt: new Date().toISOString()
    };
    set(state => {
      const next = [duplicated, ...state.tasks];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { tasks: next };
    });
    return duplicated;
  },

  addSubtask: (taskId, title) => {
    set(state => {
      const next = state.tasks.map(t => {
        if (t.id === taskId) {
          const subtasks = t.subtasks || [];
          return {
            ...t,
            subtasks: [...subtasks, { id: `sub-${Date.now()}`, title, completed: false }]
          };
        }
        return t;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { tasks: next };
    });
  },

  toggleSubtask: (taskId, subtaskId) => {
    set(state => {
      const next = state.tasks.map(t => {
        if (t.id === taskId) {
          const subtasks = (t.subtasks || []).map(s => {
            if (s.id === subtaskId) {
              return { ...s, completed: !s.completed };
            }
            return s;
          });
          return { ...t, subtasks };
        }
        return t;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { tasks: next };
    });
  },

  deleteSubtask: (taskId, subtaskId) => {
    set(state => {
      const next = state.tasks.map(t => {
        if (t.id === taskId) {
          const subtasks = (t.subtasks || []).filter(s => s.id !== subtaskId);
          return { ...t, subtasks };
        }
        return t;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { tasks: next };
    });
  },

  addComment: (taskId, commentData) => {
    set(state => {
      const next = state.tasks.map(t => {
        if (t.id === taskId) {
          const comments = t.comments || [];
          const newComment = {
            id: `c-${Date.now()}`,
            createdAt: new Date().toISOString(),
            ...commentData
          };
          return { ...t, comments: [...comments, newComment] };
        }
        return t;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { tasks: next };
    });

    useNotificationStore.getState().addNotification({
      type: 'Comment Received',
      title: 'New Comment',
      message: `Someone commented on task.`,
      taskId
    });
  },

  resetTasks: () => {
    set({ tasks: demoTasks });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoTasks));
  }
}));
