import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  glass = false,
  onClick = null,
  padding = 'p-6'
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-200 ${
        glass
          ? 'glass-panel dark:glass-panel-dark'
          : 'bg-white dark:bg-brand-indigo border-slate-200/80 dark:border-brand-darkBorder/60 shadow-subtle'
      } ${
        hover
          ? 'hover:shadow-premium hover:-translate-y-0.5 hover:border-brand-violet/30 cursor-pointer'
          : ''
      } ${padding} ${className}`}
    >
      {children}
    </div>
  );
};
