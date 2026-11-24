import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Building2, Plus, Search, Power, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const AdminWorkspacesPage = () => {
  const workspaces = useAdminStore(state => state.workspaces);
  const toggleWorkspaceStatus = useAdminStore(state => state.toggleWorkspaceStatus);
  const [search, setSearch] = useState('');

  const filtered = workspaces.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white font-heading">
            Corporate Workspaces
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage client subscriptions, provisioned seats, and tenant suspension states
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workspaces by name or owner..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/40"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase bg-slate-900/50">
                <th className="py-3 px-4">Workspace</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Seats Used</th>
                <th className="py-3 px-4">Storage</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filtered.map(ws => (
                <tr key={ws.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {ws.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {ws.owner}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-brand-violet/20 text-brand-softPurple font-semibold text-[11px]">
                      {ws.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {ws.seatsUsed} / {ws.seats}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {ws.storageUsed}
                  </td>
                  <td className="py-3.5 px-4">
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
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      size="xs"
                      variant={ws.status === 'Active' ? 'danger' : 'success'}
                      onClick={() => toggleWorkspaceStatus(ws.id)}
                    >
                      {ws.status === 'Active' ? 'Suspend' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
