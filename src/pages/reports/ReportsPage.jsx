import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useProjectStore } from '../../store/projectStore';
import { useTaskStore } from '../../store/taskStore';
import { useTeamStore } from '../../store/teamStore';
import { useTimeStore } from '../../store/timeStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { exportToCSV } from '../../utils/csvExport';
import {
  Download,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';

export const ReportsPage = () => {
  const projects = useProjectStore(state => state.projects);
  const tasks = useTaskStore(state => state.tasks);
  const team = useTeamStore(state => state.members);
  const timeEntries = useTimeStore(state => state.entries);

  const [dateRange, setDateRange] = useState('30d');
  const [projectFilter, setProjectFilter] = useState('All');

  // Summary statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'Done' || !t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const totalTrackedHours = Math.round(
    (timeEntries.reduce((acc, e) => acc + (e.durationSeconds || 0), 0) / 3600) * 10
  ) / 10;

  // Monthly velocity data
  const monthlyData = [
    { month: 'Jul', completed: 28, hours: 140 },
    { month: 'Aug', completed: 34, hours: 165 },
    { month: 'Sep', completed: 42, hours: 180 },
    { month: 'Oct', completed: 48, hours: 195 },
    { month: 'Nov', completed: 53, hours: 210 },
  ];

  // Time tracked by project
  const projectTimeData = projects.map(p => {
    const projectSecs = timeEntries
      .filter(e => e.projectId === p.id)
      .reduce((sum, e) => sum + (e.durationSeconds || 0), 0);
    return {
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      hours: Math.round((projectSecs / 3600) * 10) / 10,
      color: p.color || '#7867F7'
    };
  });

  // Team workload hours
  const teamHoursData = team.slice(0, 6).map(m => {
    const userSecs = timeEntries
      .filter(e => e.userId === m.id)
      .reduce((sum, e) => sum + (e.durationSeconds || 0), 0);
    return {
      name: m.name.split(' ')[0],
      hours: Math.round((userSecs / 3600) * 10) / 10,
    };
  });

  const handleExportCSV = () => {
    const rows = tasks.map(t => {
      const p = projects.find(proj => proj.id === t.projectId);
      const m = team.find(member => member.id === t.assigneeId);
      return {
        'Task ID': t.id,
        'Title': t.title,
        'Project': p?.name || 'N/A',
        'Assignee': m?.name || 'Unassigned',
        'Status': t.status,
        'Priority': t.priority,
        'Due Date': t.dueDate || '',
        'Estimated Hours': t.estimatedHours || 0
      };
    });
    exportToCSV('tasksphere-tasks-report', rows);
  };

  const handleExportTimeCSV = () => {
    const rows = timeEntries.map(e => {
      const p = projects.find(proj => proj.id === e.projectId);
      const m = team.find(member => member.id === e.userId);
      return {
        'Log ID': e.id,
        'Project': p?.name || 'N/A',
        'Contributor': m?.name || 'N/A',
        'Description': e.description,
        'Date': e.date,
        'Hours': (e.durationSeconds / 3600).toFixed(2),
        'Billable': e.billable ? 'Yes' : 'No'
      };
    });
    exportToCSV('tasksphere-time-logs-report', rows);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Reports & SaaS Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Performance KPIs, sprint throughput, team capacity, and exportable audit records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            icon={Download}
            size="sm"
          >
            Export Tasks CSV
          </Button>
          <Button
            onClick={handleExportTimeCSV}
            variant="primary"
            icon={Download}
            size="sm"
          >
            Export Time CSV
          </Button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Total Completed</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
              {completedTasks}/{totalTasks}
            </h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-violet/10 text-brand-violet">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Total Tracked</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
              {totalTrackedHours}h
            </h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Monthly Velocity</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
              +18.4%
            </h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Overdue Risk</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
              {overdueTasks} tasks
            </h4>
          </div>
        </Card>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Productivity Velocity */}
        <Card>
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Monthly Throughput Velocity
            </h3>
            <p className="text-xs text-slate-400">
              Completed sprint tasks vs engineering hours invested
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7867F7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7867F7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8990A5' }} />
                <YAxis tick={{ fontSize: 11, fill: '#8990A5' }} />
                <Tooltip />
                <Area type="monotone" dataKey="completed" name="Tasks Done" stroke="#7867F7" strokeWidth={3} fillOpacity={1} fill="url(#colorComp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Time Tracked by Project */}
        <Card>
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Time Tracked by Project (Hours)
            </h3>
            <p className="text-xs text-slate-400">
              Total hours billed across major active initiatives
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectTimeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8990A5' }} />
                <YAxis tick={{ fontSize: 11, fill: '#8990A5' }} />
                <Tooltip />
                <Bar dataKey="hours" name="Hours Logged" radius={[6, 6, 0, 0]}>
                  {projectTimeData.map((entry, index) => (
                    <Cell key={`proj-bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Team Member Contribution Hours */}
        <Card>
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Logged Hours by Contributor
            </h3>
            <p className="text-xs text-slate-400">
              Comparative workload breakdown for active engineers
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamHoursData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#8990A5' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#8990A5' }} />
                <Tooltip />
                <Bar dataKey="hours" name="Tracked Hours" fill="#54C7E8" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Summary Table */}
        <Card>
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Portfolio Health Metrics
            </h3>
            <p className="text-xs text-slate-400">
              High-level workspace velocity indicators
            </p>
          </div>

          <div className="space-y-4 pt-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Average Task Turnaround</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">3.4 Days</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Sprint Goal Completion</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">91.8%</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Bug Defect Density</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">0.12 / kLOC</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Code Review Latency</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">1.8 Hours</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
