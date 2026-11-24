import { create } from 'zustand';

const STORAGE_ADMIN_KEY = 'tasksphere_admin_data';

const initialWorkspaces = [
  {
    id: 'ws-1',
    name: 'TASKSPHERE HQ',
    slug: 'tasksphere-hq',
    owner: 'Alexander Wright',
    plan: 'Enterprise',
    seats: 25,
    seatsUsed: 10,
    projectsCount: 8,
    status: 'Active',
    createdDate: '2025-01-15',
    storageUsed: '4.2 GB'
  },
  {
    id: 'ws-2',
    name: 'Acme Innovations Group',
    slug: 'acme-innovations',
    owner: 'Sarah Jenkins',
    plan: 'Team Pro',
    seats: 15,
    seatsUsed: 12,
    projectsCount: 14,
    status: 'Active',
    createdDate: '2025-04-10',
    storageUsed: '2.8 GB'
  },
  {
    id: 'ws-3',
    name: 'FinTech Next Global',
    slug: 'fintech-next',
    owner: 'Rohan Mehra',
    plan: 'Enterprise',
    seats: 50,
    seatsUsed: 44,
    projectsCount: 29,
    status: 'Active',
    createdDate: '2025-06-22',
    storageUsed: '11.5 GB'
  },
  {
    id: 'ws-4',
    name: 'Orbit Design Labs',
    slug: 'orbit-labs',
    owner: 'Camilla Vasquez',
    plan: 'Starter',
    seats: 5,
    seatsUsed: 4,
    projectsCount: 6,
    status: 'Trial',
    createdDate: '2026-10-01',
    storageUsed: '850 MB'
  },
  {
    id: 'ws-5',
    name: 'CyberPulse Security',
    slug: 'cyberpulse-sec',
    owner: 'Julian Thorne',
    plan: 'Team Pro',
    seats: 20,
    seatsUsed: 18,
    projectsCount: 19,
    status: 'Suspended',
    createdDate: '2025-08-14',
    storageUsed: '6.1 GB'
  }
];

const initialPlatformActivity = [
  {
    id: 'act-1',
    action: 'Workspace Created',
    detail: 'New trial workspace "Orbit Design Labs" activated by Camilla Vasquez.',
    timestamp: '2026-11-23T09:30:00Z',
    ip: '198.51.100.42',
    status: 'Success'
  },
  {
    id: 'act-2',
    action: 'Plan Upgrade',
    detail: 'FinTech Next Global expanded seat license from 30 to 50 users.',
    timestamp: '2026-11-22T17:15:00Z',
    ip: '203.0.113.19',
    status: 'Success'
  },
  {
    id: 'act-3',
    action: 'Security Audit Log Export',
    detail: 'Alexander Wright exported SOC2 compliance archive.',
    timestamp: '2026-11-22T14:00:00Z',
    ip: '192.0.2.88',
    status: 'Success'
  },
  {
    id: 'act-4',
    action: 'Suspension Applied',
    detail: 'Workspace CyberPulse Security suspended due to billing retry failure.',
    timestamp: '2026-11-21T11:45:00Z',
    ip: 'System Automation',
    status: 'Warning'
  },
  {
    id: 'act-5',
    action: 'Admin Login',
    detail: 'Alexander Wright authenticated via SSO MFA.',
    timestamp: '2026-11-21T08:20:00Z',
    ip: '192.0.2.88',
    status: 'Success'
  }
];

const getInitialAdminState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_ADMIN_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return {
    workspaces: initialWorkspaces,
    activities: initialPlatformActivity,
    platformSettings: {
      maintenanceMode: false,
      allowPublicRegistrations: true,
      requireEmailVerification: true,
      maxFreeProjects: 3,
      apiRateLimitPerMin: 1200
    }
  };
};

export const useAdminStore = create((set, get) => ({
  ...getInitialAdminState(),

  toggleWorkspaceStatus: (id) => {
    set(state => {
      const nextWs = state.workspaces.map(w => {
        if (w.id === id) {
          const newStatus = w.status === 'Active' ? 'Suspended' : 'Active';
          return { ...w, status: newStatus };
        }
        return w;
      });
      const next = { ...state, workspaces: nextWs };
      localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(next));
      return next;
    });
  },

  updatePlatformSettings: (updates) => {
    set(state => {
      const next = {
        ...state,
        platformSettings: { ...state.platformSettings, ...updates }
      };
      localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(next));
      return next;
    });
  }
}));
