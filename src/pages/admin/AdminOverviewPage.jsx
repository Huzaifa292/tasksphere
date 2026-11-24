import React from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useProjectStore } from '../../store/projectStore';
import { useTeamStore } from '../../store/teamStore';
import { useTaskStore } from '../../store/taskStore';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { timeAgo } from '../../utils/dateUtils';
import {
  ShieldCheck,
  Building2,
  Users,
  FolderKanban,
  Activity,
  Server,
  Zap,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminOverviewPage = () => {
  const navigate = useNavigate();
  const workspaces = useAdminStore(state => state.workspaces);
  const activities = useAdminStore(state => state.activities);
  const platformSettings = useAdminStore(state => state.platformSettings);

  const projects = useProjectStore(state => state.projects);
  const team = useTeamStore(state => state.members);
  const tasks = useTaskStore(state => state.tasks);

  const activeWorkspacesCount = workspaces.filter(w => w.status === 'Active').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-brand-cyan" />
            Platform Multi-Tenant Overview
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Global metrics across all corporate SaaS tenants, compute clusters, and licenses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ● All Systems Operational
          </span>
        </div>
      </div>

      {/* Admin KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Workspaces</span>
            <Building2 className="w-5 h-5 text-brand-violet" />
          </div>
          <h3 className="text-3xl font-extrabold text-white font-heading">{workspaces.length}</h3>
          <p className="text-xs text-emerald-400 font-semibold">{activeWorkspacesCount} Active Organizations</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Users</span>
            <Users className="w-5 h-5 text-sky-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white font-heading">{team.length + 128}</h3>
          <p className="text-xs text-slate-400">Across 5 tenant tiers</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Managed Projects</span>
            <FolderKanban className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white font-heading">{projects.length + 68}</h3>
          <p className="text-xs text-emerald-400 font-semibold">+12% MoM growth</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">API Throughput</span>
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white font-mono font-heading">99.98%</h3>
          <p className="text-xs text-slate-400">Global SLA compliance</p>
        </div>
      </div>

      {/* Workspaces list preview */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-cyan" />
            Active SaaS Tenant Workspaces
          </h3>
          <button
            onClick={() => navigate('/admin/workspaces')}
            className="text-xs font-bold text-brand-cyan hover:underline"
          >
            Manage All Workspaces →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                <th className="py-2.5 px-3">Workspace</th>
                <th className="py-2.5 px-3">Plan</th>
                <th className="py-2.5 px-3">Seats</th>
                <th className="py-2.5 px-3">Storage</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {workspaces.map(ws => (
                <tr key={ws.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-white">{ws.name}</span>
                    <p className="text-[10px] text-slate-400 font-mono">owner: {ws.owner}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-brand-violet/20 text-brand-softPurple font-semibold text-[11px]">
                      {ws.plan}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {ws.seatsUsed}/{ws.seats}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {ws.storageUsed}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ws.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : ws.status === 'Trial'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {ws.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform activity stream */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-violet" />
          Real-time Audit Trail & Security Events
        </h3>

        <div className="space-y-3">
          {activities.map(act => (
            <div key={act.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${act.status === 'Success' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <div>
                  <span className="font-bold text-white">{act.action}</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">{act.detail}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-mono block">{timeAgo(act.timestamp)}</span>
                <span className="text-[10px] text-slate-400 font-mono">{act.ip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
