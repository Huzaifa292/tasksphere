import React from 'react';
import { Card } from './Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend = null, // e.g. "+12% this week"
  trendType = 'up', // 'up' | 'down' | 'neutral'
  color = 'violet', // 'violet' | 'cyan' | 'amber' | 'emerald' | 'indigo'
  subtitle = null,
  onClick = null
}) => {
  const colorMap = {
    violet: {
      bg: 'bg-brand-violet/10 text-brand-violet ring-brand-violet/20',
      bar: 'bg-brand-violet'
    },
    cyan: {
      bg: 'bg-brand-cyan/15 text-sky-600 dark:text-brand-cyan ring-brand-cyan/25',
      bar: 'bg-brand-cyan'
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20',
      bar: 'bg-amber-500'
    },
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
      bar: 'bg-emerald-500'
    },
    indigo: {
      bg: 'bg-brand-indigo/10 text-brand-indigo dark:text-brand-softPurple ring-brand-indigo/20',
      bar: 'bg-brand-indigo'
    }
  };

  const scheme = colorMap[color] || colorMap.violet;

  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className="relative overflow-hidden group border-slate-200/80 dark:border-brand-darkBorder/60"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ring-4 ${scheme.bg} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold">
          {trendType === 'up' ? (
            <span className="flex items-center text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {trend}
            </span>
          ) : trendType === 'down' ? (
            <span className="flex items-center text-rose-600 dark:text-rose-400">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              {trend}
            </span>
          ) : (
            <span className="text-slate-500">{trend}</span>
          )}
          <span className="text-slate-400 dark:text-slate-500">vs last cycle</span>
        </div>
      )}

      {/* Decorative accent bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${scheme.bar}`} />
    </Card>
  );
};
