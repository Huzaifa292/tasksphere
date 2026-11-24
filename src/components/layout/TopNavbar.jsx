import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  Clock,
  Play,
  Square,
  Menu,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { NotificationDropdown } from './NotificationDropdown';
import { UserMenu } from './UserMenu';
import { CommandPalette } from '../common/CommandPalette';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useTimeStore } from '../../store/timeStore';
import { formatTime } from '../../utils/dateUtils';

export const TopNavbar = ({ onOpenMobileMenu, onOpenQuickCreate }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuthStore(state => state.user);
  const theme = useSettingsStore(state => state.preferences.theme);
  const toggleTheme = useSettingsStore(state => state.toggleTheme);
  const notifications = useNotificationStore(state => state.notifications);

  // Time Tracker state in Navbar
  const activeTimer = useTimeStore(state => state.activeTimer);
  const startTimer = useTimeStore(state => state.startTimer);
  const stopTimer = useTimeStore(state => state.stopTimer);
  const getElapsedSeconds = useTimeStore(state => state.getElapsedSeconds);

  const [elapsed, setElapsed] = useState(getElapsedSeconds());
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  // Tick timer every second if running
  React.useEffect(() => {
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

  const unreadCount = notifications.filter(n => !n.read).length;

  // Breadcrumbs title based on route
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Workspace Dashboard';
    if (path.startsWith('/projects/')) return 'Project Details';
    if (path === '/projects') return 'Projects';
    if (path === '/tasks') return 'Tasks';
    if (path === '/board') return 'Kanban Board';
    if (path === '/my-work') return 'My Work';
    if (path === '/calendar') return 'Calendar';
    if (path === '/team') return 'Team Members';
    if (path === '/time-tracking') return 'Time Tracking';
    if (path === '/reports') return 'Reports & Analytics';
    if (path === '/messages') return 'Team Messages';
    if (path === '/discussions') return 'Project Discussions';
    if (path === '/notifications') return 'Notifications';
    if (path === '/settings') return 'Workspace Settings';
    if (path.startsWith('/admin')) return 'Platform Administration';
    return 'TASKSPHERE';
  };

  return (
    <>
      <header className="h-16 bg-white dark:bg-brand-indigo border-b border-slate-200/80 dark:border-brand-darkBorder px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
        {/* Left: Mobile hamburger + Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              TaskSphere
            </span>
            <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">/</span>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading">
              {getBreadcrumb()}
            </h1>
          </div>
        </div>

        {/* Center: Command Palette Trigger */}
        <div className="hidden lg:flex items-center max-w-sm w-full mx-4">
          <button
            onClick={() => setIsCmdOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:border-brand-violet/40 text-xs transition-all"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search or type a command...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border text-[10px] font-mono font-semibold">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Timer Pill */}
          <div
            onClick={() => navigate('/time-tracking')}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
              activeTimer?.isRunning
                ? 'border-brand-violet/40 bg-brand-violet/10 text-brand-violet shadow-sm'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title="Click to open Time Tracking"
          >
            <Clock className={`w-3.5 h-3.5 ${activeTimer?.isRunning ? 'animate-pulse text-brand-violet' : ''}`} />
            <span className="text-xs font-mono font-bold">
              {formatTime(elapsed)}
            </span>
            {activeTimer?.isRunning ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  stopTimer(user?.id);
                }}
                title="Stop Timer & Log"
                className="p-1 rounded hover:bg-brand-violet/20"
              >
                <Square className="w-3 h-3 fill-current text-rose-500" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startTimer('proj-1', null, 'Active Sprint Session');
                }}
                title="Start Quick Timer"
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <Play className="w-3 h-3 fill-current text-emerald-500" />
              </button>
            )}
          </div>

          {/* Quick Create Button */}
          <Button
            size="sm"
            variant="primary"
            icon={Plus}
            onClick={onOpenQuickCreate}
            className="shadow-sm"
          >
            <span className="hidden sm:inline">Create</span>
          </Button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-violet ring-2 ring-white dark:ring-brand-indigo" />
              )}
            </button>
            <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Avatar src={user?.avatar} name={user?.name} size="sm" status="online" />
            </button>
            <UserMenu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
          </div>
        </div>
      </header>

      {/* Cmd + K Command Palette */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
    </>
  );
};
