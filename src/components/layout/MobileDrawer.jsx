import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Columns3,
  UserCheck,
  CalendarDays,
  Users2,
  Clock,
  LineChart,
  MessageSquare,
  MessagesSquare,
  Bell,
  Settings,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../common/Avatar';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  if (!isOpen) return null;

  const navLinks = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Projects', icon: FolderKanban, path: '/projects' },
    { label: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { label: 'Kanban Board', icon: Columns3, path: '/board' },
    { label: 'My Work', icon: UserCheck, path: '/my-work' },
    { label: 'Calendar', icon: CalendarDays, path: '/calendar' },
    { label: 'Team', icon: Users2, path: '/team' },
    { label: 'Time Tracking', icon: Clock, path: '/time-tracking' },
    { label: 'Reports', icon: LineChart, path: '/reports' },
    { label: 'Messages', icon: MessageSquare, path: '/messages' },
    { label: 'Discussions', icon: MessagesSquare, path: '/discussions' },
    { label: 'Notifications', icon: Bell, path: '/notifications' },
    { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'Admin Console', icon: ShieldCheck, path: '/admin' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 md:hidden flex">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm"
        />

        {/* Drawer Slide */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-4/5 max-w-xs bg-white dark:bg-brand-indigo h-full shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-softPurple flex items-center justify-center text-white font-black text-lg">
                TS
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white font-heading">
                TASKSPHERE
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {navLinks.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-violet text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Footer User */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar src={user?.avatar} name={user?.name} size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
