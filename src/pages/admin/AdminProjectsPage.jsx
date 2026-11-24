import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useTaskStore } from '../../store/taskStore';
import { calculateProjectProgress } from '../../utils/calculations';
import { formatDate } from '../../utils/dateUtils';
import { FolderKanban, CheckSquare, Calendar, DollarSign } from 'lucide-react';

export const AdminProjectsPage = () => {
  const projects = useProjectStore(state => state.projects);
  const tasks = useTaskStore(state => state.tasks);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black text-white font-heading">
          Global Enterprise Projects
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          High-level oversight of all managed client projects, budgets, and deliverable health
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase bg-slate-900/50">
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Completion</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {projects.map(p => {
                const progress = calculateProjectProgress(p.id, tasks);
                return (
                  <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color || '#7867F7' }} />
                        <span className="font-bold text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {p.category}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">
                      {p.budget || '$50,000'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-brand-cyan rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-300">{progress}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {formatDate(p.dueDate)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-violet/20 text-brand-softPurple">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
