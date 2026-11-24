import React, { useState } from 'react';
import { useTeamStore } from '../../store/teamStore';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Search, UserCheck, UserX, Shield } from 'lucide-react';

export const AdminUsersPage = () => {
  const team = useTeamStore(state => state.members);
  const updateMember = useTeamStore(state => state.updateMember);
  const [search, setSearch] = useState('');

  const filtered = team.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id, currentStatus) => {
    updateMember(id, { status: currentStatus === 'Active' ? 'Suspended' : 'Active' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white font-heading">
            Platform Users Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Global access identity, single sign-on credentials, and account activation states
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
            placeholder="Search users by name, email, or role..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/40"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase bg-slate-900/50">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar src={m.avatar} name={m.name} size="xs" />
                      <div>
                        <span className="font-bold text-white block">{m.name}</span>
                        <span className="text-[10px] text-slate-400">{m.jobTitle}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {m.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-brand-violet/20 text-brand-softPurple font-semibold text-[11px]">
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {m.department}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {m.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {m.role !== 'Admin' && (
                      <Button
                        size="xs"
                        variant={m.status === 'Active' ? 'danger' : 'success'}
                        onClick={() => toggleStatus(m.id, m.status || 'Active')}
                      >
                        {m.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    )}
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
