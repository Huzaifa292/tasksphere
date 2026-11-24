import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { formatDate, isTaskOverdue } from '../../utils/dateUtils';
import { Calendar, CheckSquare, Clock, Paperclip, MoreVertical, CheckCircle2 } from 'lucide-react';

export const KanbanCard = ({ task, project, assignee, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: { task }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const overdue = isTaskOverdue(task.dueDate, task.status);
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.completed).length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`p-3.5 rounded-xl bg-white dark:bg-brand-indigo border transition-all duration-150 cursor-grab active:cursor-grabbing hover:shadow-premium group ${
        overdue
          ? 'border-rose-300 dark:border-rose-900/60 ring-1 ring-rose-200 dark:ring-rose-900/40'
          : 'border-slate-200/90 dark:border-brand-darkBorder/80 hover:border-brand-violet/40'
      }`}
    >
      {/* Top Tag & Priority */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md truncate max-w-[140px]"
          style={{
            backgroundColor: `${project?.color || '#7867F7'}15`,
            color: project?.color || '#7867F7'
          }}
        >
          {project?.name || 'Project'}
        </span>

        <Badge variant={task.priority} size="xs">
          {task.priority}
        </Badge>
      </div>

      {/* Title */}
      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-violet transition-colors line-clamp-2 leading-snug">
        {task.title}
      </h4>

      {/* Subtasks Progress if any */}
      {subtasks.length > 0 && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
          <CheckCircle2 className="w-3 h-3 text-brand-violet" />
          <span>{completedSubtasks}/{subtasks.length} subtasks</span>
        </div>
      )}

      {/* Bottom Footer Info */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px]">
          <span className={`flex items-center gap-1 font-medium ${overdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-400'}`}>
            <Calendar className="w-3 h-3" />
            {formatDate(task.dueDate, 'MMM d')}
          </span>
        </div>

        {assignee && (
          <Avatar src={assignee.avatar} name={assignee.name} size="xs" />
        )}
      </div>
    </div>
  );
};
