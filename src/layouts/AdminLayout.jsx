import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Building2,
  FolderKanban,
  Activity,
  Sliders,
  ArrowLeft,
  Server
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Avatar } from '../components/common/Avatar';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const adminNav = [
    { label: 'Overview', icon: ShieldCheck, path: '/admin' },
    { label: 'Workspaces', icon: Building2, path: '/admin/workspaces' },
    { label: 'Platform Users', icon: Users, path: '/admin/users' },
    { label: 'All Projects', icon: FolderKanban, path: '/admin/projects' },
    { label: 'System Activity', icon: Activity, path: '/admin/activity' },
    { label: 'Platform Settings', icon: Sliders, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-brand-cyan/30">
      {/* Top Banner Warning for Demo Context */}
      <div className="bg-gradient-to-r from-brand-violet via-brand-indigo to-slate-900 text-white text-xs py-2 px-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-brand-cyan" />
          <span className="font-bold tracking-wide">TASKSPHERE PLATFORM ADMIN CONSOLE</span>
          <span className="hidden sm:inline opacity-75">— Simulated multi-tenant SaaS superadmin control plane</span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 font-bold text-brand-cyan hover:underline hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Workspace
        </button>
      </div>

      {/* Main Admin Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Admin Navigation Sidebar */}
        <aside className="w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col justify-between hidden md:flex">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2.5 px-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-violet flex items-center justify-center font-bold text-sm">
                  TS
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide text-white font-heading">
                    SUPERADMIN
                  </h3>
                  <p className="text-[10px] text-emerald-400 font-mono">
                    ● Production Node US-East
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                {adminNav.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={idx}
                      to={item.path}
                      end={item.path === '/admin'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-brand-violet text-white shadow-glow-violet'
                            : 'text-slate-400 hover:text-white hover:bg-slate-850'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-3">
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-brand-cyan font-mono truncate">Role: SuperAdmin</p>
            </div>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-900/90">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
