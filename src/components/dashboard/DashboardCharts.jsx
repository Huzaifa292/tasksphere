import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Card } from '../common/Card';
import { useProjectStore } from '../../store/projectStore';
import { useTaskStore } from '../../store/taskStore';
import { useTeamStore } from '../../store/teamStore';

export const DashboardCharts = () => {
  const projects = useProjectStore(state => state.projects);
  const tasks = useTaskStore(state => state.tasks);
  const team = useTeamStore(state => state.members);

  // Status breakdown data
  const statusCounts = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'To Do').length, color: '#3B82F6' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, color: '#F59E0B' },
    { name: 'In Review', value: tasks.filter(t => t.status === 'In Review').length, color: '#8B5CF6' },
    { name: 'Done', value: tasks.filter(t => t.status === 'Done').length, color: '#10B981' },
    { name: 'Backlog', value: tasks.filter(t => t.status === 'Backlog').length, color: '#8990A5' },
  ];

  // Priority breakdown
  const priorityCounts = [
    { name: 'Critical', count: tasks.filter(t => t.priority === 'Critical').length, color: '#EF4444' },
    { name: 'High', count: tasks.filter(t => t.priority === 'High').length, color: '#F59E0B' },
    { name: 'Medium', count: tasks.filter(t => t.priority === 'Medium').length, color: '#3B82F6' },
    { name: 'Low', count: tasks.filter(t => t.priority === 'Low').length, color: '#10B981' },
  ];

  // Weekly productivity trend
  const weeklyVelocity = [
    { day: 'Mon', completed: 6, planned: 8 },
    { day: 'Tue', completed: 9, planned: 7 },
    { day: 'Wed', completed: 11, planned: 10 },
    { day: 'Thu', completed: 8, planned: 9 },
    { day: 'Fri', completed: 13, planned: 11 },
    { day: 'Sat', completed: 4, planned: 3 },
    { day: 'Sun', completed: 2, planned: 2 },
  ];

  // Top projects progress
  const projectProgressData = projects.slice(0, 5).map(p => ({
    name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
    progress: p.progress,
    color: p.color || '#7867F7'
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-navy text-white text-xs p-2.5 rounded-xl shadow-xl border border-white/10">
          <p className="font-bold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color || entry.fill }}>
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Velocity Trend (2 cols) */}
      <Card className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Sprint Velocity & Productivity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Completed vs planned tasks during this sprint cycle
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-brand-violet">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-violet" />
              Completed
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              Planned
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyVelocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="violetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7867F7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7867F7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8990A5' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8990A5' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="completed" name="Completed" stroke="#7867F7" strokeWidth={3} fillOpacity={1} fill="url(#violetGradient)" />
              <Area type="monotone" dataKey="planned" name="Planned" stroke="#CBD5E1" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Task Status Donut (1 col) */}
      <Card>
        <div className="mb-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
            Tasks by Status
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time pipeline distribution ({tasks.length} total)
          </p>
        </div>

        <div className="h-52 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusCounts}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {statusCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
          {statusCounts.map((status, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                {status.name}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{status.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Project Progress Bar Chart (2 cols) */}
      <Card className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Project Delivery Status
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Completion percentage computed dynamically from project tasks
            </p>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectProgressData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.6} />
              <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#8990A5' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#8990A5' }} axisLine={false} tickLine={false} width={130} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="progress" name="Progress (%)" radius={[0, 8, 8, 0]}>
                {projectProgressData.map((entry, index) => (
                  <Cell key={`proj-cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Tasks By Priority (1 col) */}
      <Card>
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
            Task Priority Distribution
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Work items grouped by severity level
          </p>
        </div>

        <div className="space-y-3.5">
          {priorityCounts.map((p, idx) => {
            const percentage = Math.round((p.count / (tasks.length || 1)) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {p.count} tasks ({percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: p.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
