import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { formatDate } from '../../utils/dateUtils';
import { calculateProjectProgress } from '../../utils/calculations';
import { useTaskStore } from '../../store/taskStore';
import { useTeamStore } from '../../store/teamStore';
import { Calendar, CheckSquare, MoreVertical, Copy, Archive, Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProjectCard = ({ project, onEdit, onDelete, onDuplicate, onArchive }) => {
  const navigate = useNavigate();
  const tasks = useTaskStore(state => state.tasks);
  const team = useTeamStore(state => state.members);

  const [menuOpen, setMenuOpen] = React.useState(false);

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const completedTasks = projectTasks.filter(t => t.status === 'Done').length;
  const progress = calculateProjectProgress(project.id, tasks);

  const manager = team.find(m => m.id === project.managerId);
  const assignedMembers = team.filter(m => (project.members || []).includes(m.id));

  return (
    <Card
      hover
      padding="p-0"
      className="overflow-hidden flex flex-col justify-between group relative"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* Cover Banner or Color header */}
      <div className="h-28 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full opacity-80"
            style={{ backgroundColor: project.color || '#7867F7' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category tag */}
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/40 text-white backdrop-blur-md border border-white/20">
          {project.category}
        </span>

        {/* Priority & Status Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <Badge variant={project.status} size="xs">
            {project.status}
          </Badge>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded-lg bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-md"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-1 w-36 bg-white dark:bg-brand-indigo rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-20 text-xs"
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(project);
                  }}
                  className="w-full px-3 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Project
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDuplicate(project.id);
                  }}
                  className="w-full px-3 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onArchive(project.id);
                  }}
                  className="w-full px-3 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Archive className="w-3.5 h-3.5" />
                  Archive
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(project.id);
                  }}
                  className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Due date overlay */}
        <div className="absolute bottom-2.5 left-3 text-white text-xs flex items-center gap-1 font-medium drop-shadow">
          <Calendar className="w-3.5 h-3.5" />
          <span>Due {formatDate(project.dueDate)}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-brand-violet transition-colors line-clamp-1">
            {project.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Progress & Task Counts */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-brand-violet" />
              {completedTasks}/{projectTasks.length} tasks
            </span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">
              {progress}%
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: project.color || '#7867F7'
              }}
            />
          </div>

          {/* Members avatars + Budget */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex -space-x-1.5 overflow-hidden">
              {assignedMembers.slice(0, 4).map(m => (
                <Avatar key={m.id} src={m.avatar} name={m.name} size="xs" />
              ))}
              {assignedMembers.length > 4 && (
                <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-brand-indigo">
                  +{assignedMembers.length - 4}
                </span>
              )}
            </div>

            {project.budget && (
              <span className="text-[11px] font-bold font-mono text-slate-500 dark:text-slate-400">
                {project.budget}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
