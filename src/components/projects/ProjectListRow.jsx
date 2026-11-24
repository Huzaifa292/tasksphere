import React from 'react';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { formatDate } from '../../utils/dateUtils';
import { calculateProjectProgress } from '../../utils/calculations';
import { useTaskStore } from '../../store/taskStore';
import { useTeamStore } from '../../store/teamStore';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Edit2, Copy, Archive, Trash2 } from 'lucide-react';

export const ProjectListRow = ({ project, onEdit, onDelete, onDuplicate, onArchive }) => {
  const navigate = useNavigate();
  const tasks = useTaskStore(state => state.tasks);
  const team = useTeamStore(state => state.members);

  const [menuOpen, setMenuOpen] = React.useState(false);

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const completedTasks = projectTasks.filter(t => t.status === 'Done').length;
  const progress = calculateProjectProgress(project.id, tasks);
  const assignedMembers = team.filter(m => (project.members || []).includes(m.id));

  return (
    <tr
      onClick={() => navigate(`/projects/${project.id}`)}
      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
    >
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: project.color || '#7867F7' }}
          />
          <div>
            <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-violet transition-colors">
              {project.name}
            </span>
            <p className="text-xs text-slate-400 line-clamp-1">
              {project.category}
            </p>
          </div>
        </div>
      </td>

      <td className="py-3.5 px-4">
        <Badge variant={project.status} size="xs">
          {project.status}
        </Badge>
      </td>

      <td className="py-3.5 px-4">
        <Badge variant={project.priority} size="xs">
          {project.priority}
        </Badge>
      </td>

      <td className="py-3.5 px-4">
        <div className="w-32">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500">{completedTasks}/{projectTasks.length}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${progress}%`, backgroundColor: project.color || '#7867F7' }}
            />
          </div>
        </div>
      </td>

      <td className="py-3.5 px-4">
        <div className="flex -space-x-1.5 overflow-hidden">
          {assignedMembers.slice(0, 3).map(m => (
            <Avatar key={m.id} src={m.avatar} name={m.name} size="xs" />
          ))}
          {assignedMembers.length > 3 && (
            <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-brand-indigo">
              +{assignedMembers.length - 3}
            </span>
          )}
        </div>
      </td>

      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
        {formatDate(project.dueDate)}
      </td>

      <td className="py-3.5 px-4 text-right relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {menuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-4 mt-1 w-36 bg-white dark:bg-brand-indigo rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-20 text-xs text-left"
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                onEdit(project);
              }}
              className="w-full px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onDuplicate(project.id);
              }}
              className="w-full px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Copy className="w-3.5 h-3.5" />
              Duplicate
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onArchive(project.id);
              }}
              className="w-full px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Archive className="w-3.5 h-3.5" />
              Archive
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onDelete(project.id);
              }}
              className="w-full px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};
