import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { useTaskStore } from '../../store/taskStore';
import { useProjectStore } from '../../store/projectStore';
import { useTeamStore } from '../../store/teamStore';
import { KanbanColumn } from '../../components/kanban/KanbanColumn';
import { KanbanCard } from '../../components/kanban/KanbanCard';
import { TaskModal } from '../../components/tasks/TaskModal';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';
import { Button } from '../../components/common/Button';
import { Plus, Search, Filter, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BoardPage = () => {
  const tasks = useTaskStore(state => state.tasks);
  const addTask = useTaskStore(state => state.addTask);
  const updateTask = useTaskStore(state => state.updateTask);
  const updateTaskStatus = useTaskStore(state => state.updateTaskStatus);
  const projects = useProjectStore(state => state.projects);
  const team = useTeamStore(state => state.members);

  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [memberFilter, setMemberFilter] = useState('All');

  const [activeDragId, setActiveDragId] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [initialColumnStatus, setInitialColumnStatus] = useState('To Do');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const columns = [
    { id: 'col-backlog', title: 'Backlog' },
    { id: 'col-todo', title: 'To Do' },
    { id: 'col-progress', title: 'In Progress' },
    { id: 'col-review', title: 'In Review' },
    { id: 'col-done', title: 'Done' }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchesProject = projectFilter === 'All' || t.projectId === projectFilter;
      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      const matchesMember = memberFilter === 'All' || t.assigneeId === memberFilter;

      return matchesSearch && matchesProject && matchesPriority && matchesMember;
    });
  }, [tasks, search, projectFilter, priorityFilter, memberFilter]);

  const handleDragStart = (event) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    // Check if dropped onto a column directly
    const targetColumn = columns.find(c => c.id === over.id);
    if (targetColumn) {
      if (activeTask.status !== targetColumn.title) {
        updateTaskStatus(activeTask.id, targetColumn.title);
        if (targetColumn.title === 'Done') {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
      return;
    }

    // Dropped onto another task in a column
    const overTask = tasks.find(t => t.id === over.id);
    if (overTask && overTask.status !== activeTask.status) {
      updateTaskStatus(activeTask.id, overTask.status);
      if (overTask.status === 'Done') {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const activeDragTask = activeDragId ? tasks.find(t => t.id === activeDragId) : null;
  const activeDragProject = activeDragTask ? projects.find(p => p.id === activeDragTask.projectId) : null;
  const activeDragAssignee = activeDragTask ? team.find(m => m.id === activeDragTask.assigneeId) : null;

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Interactive Kanban Board
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Drag and drop tasks between workflow columns to update real-time sprint state
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setInitialColumnStatus('To Do');
              setEditingTask(null);
              setCreateModalOpen(true);
            }}
            icon={Plus}
            variant="primary"
            className="shadow-sm"
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Control Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-brand-indigo border border-slate-200/80 dark:border-brand-darkBorder shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search board cards..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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

          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          >
            <option value="All">All Assignees</option>
            {team.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board Container with horizontal scroll */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-start gap-4 overflow-x-auto pb-6 pt-2">
          {columns.map(col => {
            const columnTasks = filteredTasks.filter(t => t.status === col.title);
            return (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={columnTasks}
                projects={projects}
                team={team}
                onTaskClick={(id) => setSelectedTaskId(id)}
                onAddTask={(status) => {
                  setInitialColumnStatus(status);
                  setEditingTask(null);
                  setCreateModalOpen(true);
                }}
              />
            );
          })}
        </div>

        {/* Drag Overlay Preview */}
        <DragOverlay>
          {activeDragTask ? (
            <div className="w-72 shadow-2xl rotate-2">
              <KanbanCard
                task={activeDragTask}
                project={activeDragProject}
                assignee={activeDragAssignee}
                onClick={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        initialStatus={initialColumnStatus}
        task={editingTask}
        onSave={(data) => {
          if (editingTask) updateTask(editingTask.id, data);
          else addTask(data);
        }}
      />

      {/* Task Details Modal */}
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
