import React from 'react';
import { StatCard } from '../common/StatCard';
import {
  FolderKanban,
  CheckCircle2,
  ListTodo,
  AlertTriangle,
  Users,
  Clock,
  Layers,
  Flame
} from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { useTaskStore } from '../../store/taskStore';
import { useTeamStore } from '../../store/teamStore';
import { useTimeStore } from '../../store/timeStore';
import { calculateTaskCounts } from '../../utils/calculations';
import { useNavigate } from 'react-router-dom';

export const OverviewStats = () => {
  const navigate = useNavigate();
  const projects = useProjectStore(state => state.projects);
  const tasks = useTaskStore(state => state.tasks);
  const team = useTeamStore(state => state.members);
  const timeEntries = useTimeStore(state => state.entries);

  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;

  const { total, done, pending, overdue } = calculateTaskCounts(tasks);

  const totalTrackedSeconds = timeEntries.reduce((sum, e) => sum + (e.durationSeconds || 0), 0);
  const totalTrackedHours = Math.round((totalTrackedSeconds / 3600) * 10) / 10;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Projects"
        value={projects.length}
        subtitle={`${activeProjects} Active · ${completedProjects} Done`}
        icon={FolderKanban}
        color="violet"
        trend="+2 this month"
        trendType="up"
        onClick={() => navigate('/projects')}
      />

      <StatCard
        title="Tasks Completed"
        value={done}
        subtitle={`${pending} Remaining`}
        icon={CheckCircle2}
        color="emerald"
        trend={`${Math.round((done / (total || 1)) * 100)}% rate`}
        trendType="up"
        onClick={() => navigate('/tasks')}
      />

      <StatCard
        title="Pending & Overdue"
        value={pending}
        subtitle={`${overdue} Overdue items`}
        icon={overdue > 0 ? AlertTriangle : ListTodo}
        color={overdue > 0 ? "amber" : "cyan"}
        trend={overdue > 0 ? `${overdue} urgent` : "On schedule"}
        trendType={overdue > 0 ? "down" : "up"}
        onClick={() => navigate('/board')}
      />

      <StatCard
        title="Hours Tracked"
        value={`${totalTrackedHours}h`}
        subtitle={`${team.length} Active contributors`}
        icon={Clock}
        color="indigo"
        trend="+14.2% velocity"
        trendType="up"
        onClick={() => navigate('/time-tracking')}
      />
    </div>
  );
};
