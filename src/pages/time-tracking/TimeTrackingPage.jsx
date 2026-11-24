import React, { useState, useEffect, useMemo } from 'react';
import { useTimeStore } from '../../store/timeStore';
import { useProjectStore } from '../../store/projectStore';
import { useTaskStore } from '../../store/taskStore';
import { useTeamStore } from '../../store/teamStore';
import { useAuthStore } from '../../store/authStore';
import { formatTime, formatDate } from '../../utils/dateUtils';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { ManualTimeEntryModal } from '../../components/time/ManualTimeEntryModal';
import {
  Play,
  Pause,
  Square,
  Clock,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TimeTrackingPage = () => {
  const activeTimer = useTimeStore(state => state.activeTimer);
  const startTimer = useTimeStore(state => state.startTimer);
  const pauseTimer = useTimeStore(state => state.pauseTimer);
  const stopTimer = useTimeStore(state => state.stopTimer);
  const getElapsedSeconds = useTimeStore(state => state.getElapsedSeconds);
  const entries = useTimeStore(state => state.entries);
  const addTimeEntry = useTimeStore(state => state.addTimeEntry);
  const deleteTimeEntry = useTimeStore(state => state.deleteTimeEntry);
  const updateTimerMeta = useTimeStore(state => state.updateTimerMeta);

  const projects = useProjectStore(state => state.projects);
  const tasks = useTaskStore(state => state.tasks);
  const team = useTeamStore(state => state.members);
  const user = useAuthStore(state => state.user);

  const [elapsed, setElapsed] = useState(getElapsedSeconds());
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(activeTimer?.projectId || 'proj-1');
  const [selectedTaskId, setSelectedTaskId] = useState(activeTimer?.taskId || '');
  const [timerDesc, setTimerDesc] = useState(activeTimer?.description || 'Active sprint development');

  const [filterProject, setFilterProject] = useState('All');
  const [filterMember, setFilterMember] = useState('All');

  // Keep ticker running
  useEffect(() => {
    let interval = null;
    if (activeTimer?.isRunning) {
      interval = setInterval(() => {
        setElapsed(getElapsedSeconds());
      }, 1000);
    } else {
      setElapsed(getElapsedSeconds());
    }
    return () => clearInterval(interval);
  }, [activeTimer, getElapsedSeconds]);

  // Project tasks for the active timer selector
  const currentProjectTasks = tasks.filter(t => t.projectId === selectedProjectId);

  const handleStart = () => {
    startTimer(selectedProjectId, selectedTaskId, timerDesc);
  };

  const handlePause = () => {
    pauseTimer();
  };

  const handleStop = () => {
    const entry = stopTimer(user?.id);
    if (entry) {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    }
    setElapsed(0);
  };

  // Calculations for summary
  const totalSeconds = entries.reduce((sum, e) => sum + (e.durationSeconds || 0), 0);
  const totalHours = Math.round((totalSeconds / 3600) * 10) / 10;

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySeconds = entries
    .filter(e => e.date === todayStr)
    .reduce((sum, e) => sum + (e.durationSeconds || 0), 0);
  const todayHours = Math.round((todaySeconds / 3600) * 10) / 10;

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const matchP = filterProject === 'All' || e.projectId === filterProject;
      const matchM = filterMember === 'All' || e.userId === filterMember;
      return matchP && matchM;
    });
  }, [entries, filterProject, filterMember]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Live Time Tracking
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Accurate timestamp-persisted session stopwatch and client billable time logs
          </p>
        </div>

        <Button
          onClick={() => setManualModalOpen(true)}
          icon={Plus}
          variant="outline"
          className="shadow-sm"
        >
          Manual Time Log
        </Button>
      </div>

      {/* Main Active Timer Hero Bar */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-brand-indigo border border-slate-200/80 dark:border-brand-darkBorder shadow-premium">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Controls & Inputs */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${activeTimer?.isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {activeTimer?.isRunning ? 'Timer Running' : 'Timer Idle'}
              </span>
            </div>

            <input
              type="text"
              value={timerDesc}
              onChange={(e) => {
                setTimerDesc(e.target.value);
                updateTimerMeta({ description: e.target.value });
              }}
              placeholder="What are you currently working on?"
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white bg-transparent border-0 border-b border-slate-200 dark:border-slate-700 focus:border-brand-violet focus:ring-0 w-full pb-1"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    updateTimerMeta({ projectId: e.target.value });
                  }}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Related Task
                </label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => {
                    setSelectedTaskId(e.target.value);
                    updateTimerMeta({ taskId: e.target.value });
                  }}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
                >
                  <option value="">(No specific task)</option>
                  {currentProjectTasks.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stopwatch Digital Display & Play Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-6 lg:border-l lg:border-slate-200 dark:lg:border-slate-800 lg:pl-8">
            <div className="text-center">
              <span className="text-4xl sm:text-5xl font-mono font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
                {formatTime(elapsed)}
              </span>
              <p className="text-[11px] font-bold text-slate-400 uppercase mt-1">
                HH : MM : SS
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activeTimer?.isRunning ? (
                <button
                  onClick={handlePause}
                  className="p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg transition-transform active:scale-95"
                  title="Pause Timer"
                >
                  <Pause className="w-5 h-5 fill-current" />
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className="p-3.5 rounded-2xl bg-brand-violet hover:bg-brand-violetHover text-white shadow-glow-violet transition-transform active:scale-95"
                  title="Start Timer"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
              )}

              <button
                onClick={handleStop}
                disabled={elapsed === 0 && !activeTimer?.isRunning}
                className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-30 disabled:pointer-events-none text-white shadow-md transition-transform active:scale-95"
                title="Stop & Log Session"
              >
                <Square className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-violet/10 text-brand-violet">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Total Tracked</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
              {totalHours} hrs
            </h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Logged Today</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
              {todayHours} hrs
            </h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-500">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Total Sessions</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
              {entries.length}
            </h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Billable Ratio</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
              92.4%
            </h4>
          </div>
        </Card>
      </div>

      {/* Time Log Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-brand-darkBorder bg-white dark:bg-brand-indigo overflow-hidden shadow-subtle">
        {/* Table Filter Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white font-heading">
            Time Log History ({filteredEntries.length})
          </h3>

          <div className="flex items-center gap-3">
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            >
              <option value="All">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select
              value={filterMember}
              onChange={(e) => setFilterMember(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            >
              <option value="All">All Team Members</option>
              {team.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 font-bold uppercase text-[10px] text-slate-400 bg-slate-50/60 dark:bg-slate-900/40">
                <th className="py-3 px-4">Contributor</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Billable</th>
                <th className="py-3 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEntries.map(entry => {
                const project = projects.find(p => p.id === entry.projectId);
                const member = team.find(m => m.id === entry.userId);

                return (
                  <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar src={member?.avatar} name={member?.name} size="xs" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{member?.name || 'Alexander Wright'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-brand-violet truncate max-w-[150px] inline-block">
                        {project?.name || 'Workspace'}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs text-slate-600 dark:text-slate-300">
                      <p className="truncate">{entry.description || 'Sprint task development'}</p>
                    </td>

                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(entry.date)}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {formatTime(entry.durationSeconds)}
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant={entry.billable ? 'success' : 'default'} size="xs">
                        {entry.billable ? 'Billable' : 'Internal'}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteTimeEntry(entry.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-500"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Modal */}
      <ManualTimeEntryModal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        onSave={addTimeEntry}
      />
    </div>
  );
};
