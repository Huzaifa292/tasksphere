import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatDate } from '../../utils/dateUtils';
import { Sparkles, Calendar } from 'lucide-react';

export const DashboardHeader = () => {
  const user = useAuthStore(state => state.user);
  const workspace = useSettingsStore(state => state.workspace);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const todayStr = formatDate(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-brand-darkBorder/60">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-brand-violet tracking-wide uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{workspace?.name || 'TASKSPHERE HQ'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
          {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'Alexander'} 👋
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Here is what is happening across your workspace sprints today.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white dark:bg-brand-indigo border border-slate-200/80 dark:border-brand-darkBorder text-xs text-slate-600 dark:text-slate-300 shadow-subtle">
        <Calendar className="w-4 h-4 text-brand-violet" />
        <span className="font-semibold">{todayStr}</span>
      </div>
    </div>
  );
};
