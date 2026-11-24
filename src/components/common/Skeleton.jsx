import React from 'react';

export const Skeleton = ({ className = '', height = 'h-4', width = 'w-full', rounded = 'rounded-lg' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${height} ${width} ${rounded} ${className}`}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-indigo space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton width="w-24" height="h-6" />
        <Skeleton width="w-8" height="h-8" rounded="rounded-full" />
      </div>
      <Skeleton width="w-3/4" height="h-8" />
      <Skeleton width="w-full" height="h-4" />
      <Skeleton width="w-1/2" height="h-4" />
    </div>
  );
};
