import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import { Plus } from 'lucide-react';

export const KanbanColumn = ({
  column,
  tasks,
  projects,
  team,
  onTaskClick,
  onAddTask
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id
  });

  const columnColors = {
    'Backlog': { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
    'To Do': { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' },
    'In Progress': { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
    'In Review': { dot: 'bg-purple-500', badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300' },
    'Done': { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
  };

  const scheme = columnColors[column.title] || columnColors['To Do'];

  return (
    <div
      ref={setNodeRef}
      className={`w-72 sm:w-80 flex-shrink-0 flex flex-col rounded-2xl transition-colors duration-150 p-3 ${
        isOver
          ? 'bg-brand-violet/10 ring-2 ring-brand-violet/30'
          : 'bg-slate-100/70 dark:bg-brand-navy/60 border border-slate-200/60 dark:border-brand-darkBorder/40'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${scheme.dot}`} />
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-100">
            {column.title}
          </h3>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${scheme.badge}`}>
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(column.title)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          title={`Add task to ${column.title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task List */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2.5 overflow-y-auto min-h-[350px] pr-0.5">
          {tasks.map(task => {
            const project = projects.find(p => p.id === task.projectId);
            const assignee = team.find(m => m.id === task.assigneeId);
            return (
              <KanbanCard
                key={task.id}
                task={task}
                project={project}
                assignee={assignee}
                onClick={() => onTaskClick(task.id)}
              />
            );
          })}
        </div>
      </SortableContext>
    </div>
  );
};
