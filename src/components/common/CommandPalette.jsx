import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, FolderKanban, CheckSquare, Users, Calendar, Clock, BarChart3, Settings, ShieldCheck, ArrowRight } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { useTaskStore } from '../../store/taskStore';
import { useTeamStore } from '../../store/teamStore';

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const projects = useProjectStore(state => state.projects);
  const tasks = useTaskStore(state => state.tasks);
  const team = useTeamStore(state => state.members);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = query
    ? projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
    : projects.slice(0, 3);

  const filteredTasks = query
    ? tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : tasks.slice(0, 4);

  const filteredMembers = query
    ? team.filter(m => m.name.toLowerCase().includes(query.toLowerCase()) || m.jobTitle.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : [];

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  const quickNav = [
    { label: 'Workspace Dashboard', icon: BarChart3, path: '/dashboard' },
    { label: 'Kanban Board', icon: FolderKanban, path: '/board' },
    { label: 'All Tasks', icon: CheckSquare, path: '/tasks' },
    { label: 'Interactive Calendar', icon: Calendar, path: '/calendar' },
    { label: 'Time Tracking', icon: Clock, path: '/time-tracking' },
    { label: 'Team Directory', icon: Users, path: '/team' },
    { label: 'Workspace Settings', icon: Settings, path: '/settings' },
    { label: 'Admin Console', icon: ShieldCheck, path: '/admin' }
  ];

  const filteredNav = query
    ? quickNav.filter(n => n.label.toLowerCase().includes(query.toLowerCase()))
    : quickNav.slice(0, 5);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-2xl bg-white dark:bg-brand-indigo rounded-2xl shadow-2xl border border-slate-200 dark:border-brand-darkBorder z-10 overflow-hidden"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command, project, task, or member..."
              className="w-full bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 text-base"
            />
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded">
              ESC
            </kbd>
          </div>

          <div className="max-h-96 overflow-y-auto p-3 space-y-4">
            {/* Quick Navigation */}
            <div>
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Navigation
              </p>
              <div className="space-y-0.5">
                {filteredNav.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-violet/10 hover:text-brand-violet transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-brand-violet" />
                        <span>{item.label}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-brand-violet transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Projects */}
            {filteredProjects.length > 0 && (
              <div>
                <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Projects
                </p>
                <div className="space-y-0.5">
                  {filteredProjects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSelect(`/projects/${p.id}`)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-violet/10 hover:text-brand-violet transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color || '#7867F7' }} />
                        <span className="font-medium truncate">{p.name}</span>
                        <span className="text-xs text-slate-400">({p.progress}%)</span>
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-brand-violet">View Project</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks */}
            {filteredTasks.length > 0 && (
              <div>
                <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Tasks
                </p>
                <div className="space-y-0.5">
                  {filteredTasks.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleSelect('/tasks')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-violet/10 hover:text-brand-violet transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CheckSquare className="w-4 h-4 text-slate-400 group-hover:text-brand-violet flex-shrink-0" />
                        <span className="truncate">{t.title}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium flex-shrink-0 ml-2">
                        {t.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Team Members */}
            {filteredMembers.length > 0 && (
              <div>
                <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Team Members
                </p>
                <div className="space-y-0.5">
                  {filteredMembers.map(m => (
                    <button
                      key={m.id}
                      onClick={() => handleSelect('/team')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-violet/10 hover:text-brand-violet transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-medium">{m.name}</span>
                        <span className="text-xs text-slate-400">({m.jobTitle})</span>
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-brand-violet">{m.role}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Use <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded font-semibold border">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded font-semibold border">↓</kbd> to navigate</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded font-semibold border">ESC</kbd> to exit</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
