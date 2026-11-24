import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-navy flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative gradient glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-violet/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-violet to-brand-softPurple flex items-center justify-center text-white font-black text-2xl shadow-glow-violet group-hover:scale-105 transition-transform">
            TS
          </div>
          <div className="text-left">
            <h1 className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white font-heading">
              TASKSPHERE
            </h1>
            <p className="text-[10px] font-bold text-brand-violet tracking-widest uppercase">
              PLAN SMARTER. WORK BETTER. ACHIEVE MORE.
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white dark:bg-brand-indigo py-8 px-6 sm:px-10 shadow-premium rounded-2xl border border-slate-200/80 dark:border-brand-darkBorder/80">
          <Outlet />
        </div>

        {/* Demo banner credentials */}
        <div className="mt-6 p-4 rounded-xl bg-brand-violet/5 dark:bg-brand-violet/10 border border-brand-violet/20 text-xs text-slate-600 dark:text-slate-300 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-brand-violet">
            <Sparkles className="w-4 h-4" />
            Quick Demo Login Accounts (Simulated Auth):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded bg-white dark:bg-brand-indigo border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-800 dark:text-slate-200">Admin Account:</span><br />
              admin@tasksphere.demo<br />
              <span className="text-brand-violet">TaskSphere123!</span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-brand-indigo border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-800 dark:text-slate-200">Member Account:</span><br />
              member@tasksphere.demo<br />
              <span className="text-brand-violet">Member123!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
