import React, { useState, useMemo } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useProjectStore } from '../../store/projectStore';
import { useTeamStore } from '../../store/teamStore';
import { useAuthStore } from '../../store/authStore';
import { TaskModal } from '../../components/tasks/TaskModal';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate, isTaskOverdue } from '../../utils/dateUtils';
import {
  Plus,
  Search,
  Filter,
  CheckSquare,
  Clock,
  Calendar,
  AlertTriangle,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  Circle,
  CheckCircle2,
  ListTodo
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TasksPage = () => {
  const tasks = useTaskStore(state => state.tasks);
  const addTask = useTaskStore(state => state.addTask);
  const updateTask = useTaskStore(state => state.updateTask);
  const updateTaskStatus = useTaskStore(state => state.updateTaskStatus);
  const deleteTask = useTaskStore(state => state.deleteTask);
  const duplicateTask = useTaskStore(state => state.duplicateTask);

  const projects = useProjectStore(state => state.projects);
  const team = useTeamStore(state => state.members);
  const user = useAuthStore(state => state.user);

  // View tabs
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my' | 'assigned' | 'created' | 'completed' | 'overdue'

  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' | 'priority' | 'title'

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const handleToggleComplete = (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'Done' ? 'To Do' : 'Done';
    updateTaskStatus(taskId, nextStatus);
    if (nextStatus === 'Done') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => {
        // Tab filtering
        if (activeTab === 'my') {
          if (t.assigneeId !== user?.id) return false;
        } else if (activeTab === 'assigned') {
          if (!t.assigneeId) return false;
        } else if (activeTab === 'created') {
          if (t.createdById !== user?.id) return false;
        } else if (activeTab === 'completed') {
          if (t.status !== 'Done') return false;
        } else if (activeTab === 'overdue') {
          if (!isTaskOverdue(t.dueDate, t.status)) return false;
        }

        // Search
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
          (t.description && t.description.toLowerCase().includes(search.toLowerCase())) ||
          (t.tags && t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())));

        // Dropdown filters
        const matchesProject = projectFilter === 'All' || t.projectId === projectFilter;
        const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

        return matchesSearch && matchesProject && matchesPriority && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'priority') {
          const map = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          return (map[b.priority] || 0) - (map[a.priority] || 0);
        }
        return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      });
  }, [tasks, activeTab, search, projectFilter, priorityFilter, statusFilter, sortBy, user]);

  const tabs = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    { id: 'my', label: 'Assigned to Me', count: tasks.filter(t => t.assigneeId === user?.id).length },
    { id: 'created', label: 'Created by Me', count: tasks.filter(t => t.createdById === user?.id).length },
    { id: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'Done').length },
    { id: 'overdue', label: 'Overdue', count: tasks.filter(t => isTaskOverdue(t.dueDate, t.status)).length, alert: true },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Task Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track, assign, prioritize, and execute sprint deliverables across your teams
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
          New Task
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-brand-violet text-brand-violet'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                tab.alert && tab.count > 0
                  ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                  : activeTab === tab.id
                  ? 'bg-brand-violet/10 text-brand-violet'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-brand-indigo border border-slate-200/80 dark:border-brand-darkBorder shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, descriptions, or tags..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Project */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          >
            <option value="All">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          >
            <option value="All">All Statuses</option>
            <option value="Backlog">Backlog</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Done">Done</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Task Table */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks found"
          description="Try modifying search query or filters, or add a new task."
          actionLabel="Add Task"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200/80 dark:border-brand-darkBorder bg-white dark:bg-brand-indigo overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 font-bold uppercase text-[10px] text-slate-400 bg-slate-50/60 dark:bg-slate-900/40">
                  <th className="py-3 px-4 w-10">Done</th>
                  <th className="py-3 px-4">Task</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTasks.map(task => {
                  const project = projects.find(p => p.id === task.projectId);
                  const assignee = team.find(m => m.id === task.assigneeId);
                  const isDone = task.status === 'Done';
                  const overdue = isTaskOverdue(task.dueDate, task.status);

                  return (
                    <tr
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleComplete(task.id, task.status)}
                          className={`transition-colors ${
                            isDone ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-500'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white group-hover:text-brand-violet transition-colors'}`}>
                            {task.title}
                          </span>
                          {overdue && (
                            <Badge variant="Critical" size="xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[150px] inline-block">
                          {project?.name || 'Workspace'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant={task.status} size="xs">
                          {task.status}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant={task.priority} size="xs">
                          {task.priority}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        {assignee ? (
                          <div className="flex items-center gap-1.5">
                            <Avatar src={assignee.avatar} name={assignee.name} size="xs" />
                            <span className="truncate max-w-[110px]">{assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      <td className={`py-3.5 px-4 whitespace-nowrap font-medium ${overdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500'}`}>
                        {formatDate(task.dueDate)}
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setCreateModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-violet hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => duplicateTask(task.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-violet hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        task={editingTask}
        onSave={(data) => {
          if (editingTask) updateTask(editingTask.id, data);
          else addTask(data);
        }}
      />

      {/* Task Detail Modal */}
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
