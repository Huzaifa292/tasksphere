import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
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
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useTaskStore } from '../../store/taskStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useMessageStore } from '../../store/messageStore';
import { Avatar } from '../common/Avatar';
import { useAuthStore } from '../../store/authStore';

export const Sidebar = () => {
  const location = useLocation();
  const collapsed = useSettingsStore(state => state.preferences.sidebarCollapsed);
  const toggleSidebar = useSettingsStore(state => state.toggleSidebar);
  const workspace = useSettingsStore(state => state.workspace);
  const user = useAuthStore(state => state.user);

  const tasks = useTaskStore(state => state.tasks);
  const notifications = useNotificationStore(state => state.notifications);
  const conversations = useMessageStore(state => state.conversations);

  const pendingTasksCount = tasks.filter(t => t.status !== 'Done').length;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const navGroups = [
    {
      group: 'Workspace',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Projects', icon: FolderKanban, path: '/projects' },
        { label: 'All Tasks', icon: CheckSquare, path: '/tasks', badge: pendingTasksCount },
        { label: 'Kanban Board', icon: Columns3, path: '/board' },
        { label: 'My Work', icon: UserCheck, path: '/my-work' },
      ]
    },
    {
      group: 'Collaboration',
      items: [
        { label: 'Calendar', icon: CalendarDays, path: '/calendar' },
        { label: 'Team', icon: Users2, path: '/team' },
        { label: 'Messages', icon: MessageSquare, path: '/messages', badge: unreadMessagesCount },
        { label: 'Discussions', icon: MessagesSquare, path: '/discussions' },
        { label: 'Notifications', icon: Bell, path: '/notifications', badge: unreadNotifsCount },
      ]
    },
    {
      group: 'Performance',
      items: [
        { label: 'Time Tracking', icon: Clock, path: '/time-tracking' },
        { label: 'Reports & Analytics', icon: LineChart, path: '/reports' },
      ]
    },
    {
      group: 'Administration',
      items: [
        { label: 'Settings', icon: Settings, path: '/settings' },
        { label: 'Admin Console', icon: ShieldCheck, path: '/admin', highlight: true },
      ]
    }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col flex-shrink-0 bg-white dark:bg-brand-indigo border-r border-slate-200/80 dark:border-brand-darkBorder transition-all duration-300 relative z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-100 dark:border-slate-800/80 justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo Mark */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-softPurple flex items-center justify-center text-white font-black text-xl shadow-glow-violet flex-shrink-0">
            TS
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white font-heading truncate">
                TASKSPHERE
              </span>
              <span className="text-[10px] font-semibold text-brand-violet tracking-wider uppercase truncate">
                {workspace?.plan || 'Enterprise Tier'}
              </span>
            </div>
          )}
        </div>

        {/* Sidebar Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                {group.group}
              </p>
            )}
            {group.items.map((item, iIdx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

              return (
                <NavLink
                  key={iIdx}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-brand-violet text-white shadow-sm shadow-brand-violet/30'
                      : item.highlight
                      ? 'text-brand-violet hover:bg-brand-violet/10 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-white' : item.highlight ? 'text-brand-violet' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                  }`} />

                  {!collapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}

                  {!collapsed && item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                        isActive
                          ? 'bg-white text-brand-violet'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Active Indicator on collapsed */}
                  {collapsed && isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full" />
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Bottom Widget */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
        >
          <Avatar src={user?.avatar} name={user?.name} size="sm" status="online" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.name || 'Alexander Wright'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.jobTitle || 'Product Manager'}
              </p>
            </div>
          )}
        </NavLink>
      </div>
    </aside>
  );
};
