import React from 'react';
import { Card } from '../common/Card';
import { useNotificationStore } from '../../store/notificationStore';
import { timeAgo } from '../../utils/dateUtils';
import { Activity, ArrowRight, CheckCircle2, UserPlus, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecentActivityWidget = () => {
  const navigate = useNavigate();
  const notifications = useNotificationStore(state => state.notifications);

  const getIcon = (type) => {
    switch (type) {
      case 'Task Completed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Team Member Added':
        return <UserPlus className="w-3.5 h-3.5 text-blue-500" />;
      case 'Comment Received':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-500" />;
      case 'Task Overdue':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-brand-violet" />;
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-violet" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
            Recent Workspace Activity
          </h3>
        </div>
        <button
          onClick={() => navigate('/notifications')}
          className="text-xs font-semibold text-brand-violet hover:underline flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {notifications.slice(0, 5).map(item => (
          <div key={item.id} className="flex items-start gap-3 text-xs">
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 mt-0.5">
              {getIcon(item.type)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {item.title}
              </p>
              <p className="text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {item.message}
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {timeAgo(item.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
