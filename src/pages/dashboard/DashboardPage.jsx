import React from 'react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { OverviewStats } from '../../components/dashboard/OverviewStats';
import { DashboardCharts } from '../../components/dashboard/DashboardCharts';
import { UpcomingDeadlinesWidget } from '../../components/dashboard/UpcomingDeadlinesWidget';
import { RecentActivityWidget } from '../../components/dashboard/RecentActivityWidget';
import { MyTasksQuickWidget } from '../../components/dashboard/MyTasksQuickWidget';
import { Button } from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Columns3,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. Header with greeting, workspace name, date */}
      <DashboardHeader />

      {/* 2. Top Metric Cards */}
      <OverviewStats />

      {/* 3. Recharts Visualizations */}
      <DashboardCharts />

      {/* 4. Lower Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MyTasksQuickWidget />
        <UpcomingDeadlinesWidget />
        <RecentActivityWidget />
      </div>

      {/* Quick Launchpad Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-indigo via-brand-navy to-brand-indigo text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-brand-violet/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-violet/20 text-brand-softPurple border border-brand-violet/30">
            <Sparkles className="w-5 h-5 text-brand-softPurple" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-heading">
              Interactive Sprint Board & Collaboration
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Drag tasks between stages or log live session hours with one click.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="cyan"
            icon={Columns3}
            onClick={() => navigate('/board')}
          >
            Open Kanban Board
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-white border-white/20 bg-white/5 hover:bg-white/10"
            icon={Clock}
            onClick={() => navigate('/time-tracking')}
          >
            Track Time
          </Button>
        </div>
      </div>
    </div>
  );
};
