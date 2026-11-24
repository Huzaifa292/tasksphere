import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  isLoading = false,
  disabled = false,
  onClick,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-brand-violet hover:bg-brand-violetHover text-white shadow-sm hover:shadow-glow-violet focus:ring-brand-violet/40',
    secondary: 'bg-brand-indigo hover:bg-brand-navy text-white shadow-sm focus:ring-brand-indigo/40',
    outline: 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-brand-text dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm focus:ring-brand-violet/30',
    ghost: 'text-slate-600 dark:text-slate-300 hover:text-brand-text dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 focus:ring-slate-300',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-rose-500/25 focus:ring-rose-500/40',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500/40',
    cyan: 'bg-brand-cyan hover:brightness-105 text-brand-navy shadow-sm hover:shadow-glow-cyan focus:ring-brand-cyan/40',
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
    icon: 'p-2 rounded-lg',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 text-current" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 text-current" />}
        </>
      )}
    </button>
  );
};
