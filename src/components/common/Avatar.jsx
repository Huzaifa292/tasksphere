import React from 'react';

export const Avatar = ({ src, name = 'User', size = 'md', className = '', status = null }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusSize = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover ring-2 ring-white/80 dark:ring-brand-indigo`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full bg-gradient-to-tr from-brand-violet to-brand-softPurple text-white font-semibold items-center justify-center ring-2 ring-white/80 dark:ring-brand-indigo ${
          src ? 'hidden' : 'flex'
        }`}
      >
        {getInitials(name)}
      </div>

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-brand-indigo ${
            statusSize[size] || statusSize.md
          } ${
            status === 'online'
              ? 'bg-emerald-500'
              : status === 'busy'
              ? 'bg-amber-500'
              : 'bg-slate-400'
          }`}
          title={status}
        />
      )}
    </div>
  );
};
