import React, { useState, useMemo } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { useProjectStore } from '../../store/projectStore';
import { useTimeStore } from '../../store/timeStore';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { TaskModal } from '../../components/tasks/TaskModal';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';
import { formatDate, isTaskOverdue } from '../../utils/dateUtils';
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  AlertTriangle,
  Plus,
  Flame,
  CheckSquare,
  Sparkles,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MyWorkPage = () => {
  const user = useAuthStore(state => state.user);
  const tasks = useTaskStore(state => state.tasks);
  const addTask = useTaskStore(state => state.addTask);
  const updateTask = useTaskStore(state => state.updateTask);
  const updateTaskStatus = useTaskStore(state => state.updateTaskStatus);
  const projects = useProjectStore(state => state.projects);
  const timeEntries = useTimeStore(state => state.entries);

  const [activeSection, setActiveSection] = useState('all'); // 'all' | 'assigned' | 'created' | 'deadlines' | 'overdue' | 'completed'
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // My stats calculation
  const myAssignedTasks = tasks.filter(t => t.assigneeId === user?.id);
  const myCompletedTasks = myAssignedTasks.filter(t => t.status === 'Done');
  const myPendingTasks = myAssignedTasks.filter(t => t.status !== 'Done');
  const myOverdueTasks = myAssignedTasks.filter(t => isTaskOverdue(t.dueDate, t.status));

  const myLoggedSeconds = timeEntries
    .filter(e => e.userId === user?.id)
    .reduce((sum, e) => sum + (e.durationSeconds || 0), 0);
  const myLoggedHours = Math.round((myLoggedSeconds / 3600) * 10) / 10;

  const completionRate = myAssignedTasks.length > 0
    ? Math.round((myCompletedTasks.length / myAssignedTasks.length) * 100)
    : 100;

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => {
        if (activeSection === 'assigned') {
          if (t.assigneeId !== user?.id) return false;
        } else if (activeSection === 'created') {
          if (t.createdById !== user?.id) return false;
        } else if (activeSection === 'deadlines') {
          if (t.assigneeId !== user?.id || t.status === 'Done' || !t.dueDate) return false;
        } else if (activeSection === 'overdue') {
          if (t.assigneeId !== user?.id || !isTaskOverdue(t.dueDate, t.status)) return false;
        } else if (activeSection === 'completed') {
          if (t.assigneeId !== user?.id || t.status !== 'Done') return false;
        } else {
          // 'all' my work
          if (t.assigneeId !== user?.id && t.createdById !== user?.id) return false;
        }

        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
        const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;

        return matchesSearch && matchesPriority;
      })
      .sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
  }, [tasks, activeSection, search, priorityFilter, user]);

  const handleToggle = (taskId, currentStatus) => {
    const next = currentStatus === 'Done' ? 'To Do' : 'Done';
    updateTaskStatus(taskId, next);
    if (next === 'Done') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Personal Productivity Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Focus workspace tailored exclusively for your assigned sprint priorities
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingTask(null);
            setCreateModalOpen(true);
          }}
          icon={Plus}
          variant="primary"
          className="shadow-sm"
        >
          Quick Create Task
        </Button>
      </div>

      {/* Personal Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-violet/10 text-brand-violet">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Active Tasks</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
              {myPendingTasks.length}
            </h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Completion Rate</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
              {completionRate}%
            </h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Hours Tracked</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
              {myLoggedHours}h
            </h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Overdue Tasks</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
              {myOverdueTasks.length}
            </h4>
          </div>
        </Card>
      </div>

      {/* Navigation Filter Badges */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'all', label: 'All My Work', count: myAssignedTasks.length },
          { id: 'assigned', label: 'Assigned to Me', count: myPendingTasks.length },
          { id: 'created', label: 'Created by Me', count: tasks.filter(t => t.createdById === user?.id).length },
          { id: 'deadlines', label: 'Upcoming Deadlines', count: myPendingTasks.filter(t => t.dueDate).length },
          { id: 'overdue', label: 'Overdue', count: myOverdueTasks.length },
          { id: 'completed', label: 'Completed', count: myCompletedTasks.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === tab.id
                ? 'bg-brand-violet text-white shadow-sm'
                : 'bg-white dark:bg-brand-indigo text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeSection === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-brand-indigo/30">
            <Sparkles className="w-8 h-8 text-brand-violet mx-auto mb-2" />
            <h4 className="text-base font-bold text-slate-800 dark:text-white">Clean workspace!</h4>
            <p className="text-xs text-slate-500 mt-1">No tasks pending under this category.</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const project = projects.find(p => p.id === task.projectId);
            const isDone = task.status === 'Done';
            const overdue = isTaskOverdue(task.dueDate, task.status);

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className="p-4 rounded-2xl bg-white dark:bg-brand-indigo border border-slate-200/80 dark:border-brand-darkBorder shadow-subtle hover:border-brand-violet/40 cursor-pointer transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(task.id, task.status);
                    }}
                    className={`transition-colors ${isDone ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-500'}`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white group-hover:text-brand-violet transition-colors'}`}>
                        {task.title}
                      </span>
                      {overdue && (
                        <Badge variant="Critical" size="xs">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="font-semibold text-brand-violet">{project?.name || 'Workspace'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(task.dueDate)}
                      </span>
                      {task.estimatedHours && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {task.estimatedHours}h estimated
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={task.priority} size="xs">
                    {task.priority}
                  </Badge>
                  <Badge variant={task.status} size="xs">
                    {task.status}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        task={editingTask}
        onSave={(data) => {
          if (editingTask) updateTask(editingTask.id, data);
          else addTask({ ...data, assigneeId: user?.id });
        }}
      />

      <TaskDetailModal
        isOpen={!!selectedTaskId}
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onEdit={(taskToEdit) => {
          setEditingTask(taskToEdit);
          setCreateModalOpen(true);
        }}
      />
    </div>
  );
};
