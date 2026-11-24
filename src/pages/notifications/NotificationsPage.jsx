import React, { useState, useMemo } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { timeAgo } from '../../utils/dateUtils';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  CheckCircle2,
  UserPlus,
  AlertCircle,
  MessageSquare,
  Activity,
  FolderKanban
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const notifications = useNotificationStore(state => state.notifications);
  const markAsRead = useNotificationStore(state => state.markAsRead);
  const markAllAsRead = useNotificationStore(state => state.markAllAsRead);
  const deleteNotification = useNotificationStore(state => state.deleteNotification);

  const [typeFilter, setTypeFilter] = useState('All');
  const [readFilter, setReadFilter] = useState('All'); // 'All' | 'Unread' | 'Read'

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      const matchType = typeFilter === 'All' || n.type === typeFilter;
      const matchRead = readFilter === 'All' || (readFilter === 'Unread' ? !n.read : n.read);
      return matchType && matchRead;
    });
  }, [notifications, typeFilter, readFilter]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'Task Completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Task Assigned':
        return <Activity className="w-4 h-4 text-brand-violet" />;
      case 'Team Member Added':
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'Comment Received':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'Project Updated':
        return <FolderKanban className="w-4 h-4 text-sky-500" />;
      case 'Task Overdue':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <Bell className="w-4 h-4 text-brand-violet" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Notifications Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time activity audit, task assignments, and milestone updates ({unreadCount} unread)
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={() => markAllAsRead()}
            icon={CheckCheck}
            variant="outline"
            size="sm"
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-brand-indigo border border-slate-200/80 dark:border-brand-darkBorder shadow-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {['All', 'Unread', 'Read'].map(r => (
            <button
              key={r}
              onClick={() => setReadFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                readFilter === r
                  ? 'bg-brand-violet text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
        >
          <option value="All">All Notification Types</option>
          <option value="Task Assigned">Task Assigned</option>
          <option value="Task Completed">Task Completed</option>
          <option value="Comment Received">Comment Received</option>
          <option value="Project Updated">Project Updated</option>
          <option value="Team Member Added">Team Member Added</option>
          <option value="Deadline Approaching">Deadline Approaching</option>
          <option value="Task Overdue">Task Overdue</option>
        </select>
      </div>

      {/* Notification items */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-brand-indigo/30">
            <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-base font-bold text-slate-800 dark:text-white">All caught up!</h4>
            <p className="text-xs text-slate-500 mt-1">No notifications matching selected filters.</p>
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              onClick={() => {
                markAsRead(item.id);
                if (item.projectId) navigate(`/projects/${item.projectId}`);
                else if (item.taskId) navigate('/tasks');
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 group ${
                !item.read
                  ? 'bg-white dark:bg-brand-indigo border-brand-violet/30 shadow-subtle ring-1 ring-brand-violet/10'
                  : 'bg-white/70 dark:bg-brand-indigo/60 border-slate-200/80 dark:border-brand-darkBorder/60 hover:bg-white dark:hover:bg-brand-indigo'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs font-bold ${!item.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {item.title}
                    </h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-violet flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {timeAgo(item.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => deleteNotification(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
