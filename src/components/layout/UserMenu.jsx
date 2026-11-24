import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Settings, ShieldCheck, LogOut, ArrowRightLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { demoUsers } from '../../data/demoUsers';
import { Avatar } from '../common/Avatar';

export const UserMenu = ({ isOpen, onClose }) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const switchUser = useAuthStore(state => state.switchUser);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 mt-2 w-72 bg-white dark:bg-brand-indigo rounded-2xl shadow-2xl border border-slate-200/80 dark:border-brand-darkBorder z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800"
      >
        {/* User Info Header */}
        <div className="p-4 flex items-center gap-3">
          <Avatar src={user?.avatar} name={user?.name} size="md" status="online" />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
              {user?.name || 'Alexander Wright'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.email || 'admin@tasksphere.demo'}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-brand-violet/10 text-brand-violet">
              {user?.role || 'Admin'}
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="p-1.5 space-y-0.5 text-sm">
          <button
            onClick={() => {
              navigate('/settings');
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
          >
            <User className="w-4 h-4 text-slate-400" />
            <span>Profile & Account</span>
          </button>
          <button
            onClick={() => {
              navigate('/settings');
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Workspace Settings</span>
          </button>
          <button
            onClick={() => {
              navigate('/admin');
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-brand-violet/10 hover:text-brand-violet transition-colors text-left font-medium"
          >
            <ShieldCheck className="w-4 h-4 text-brand-violet" />
            <span>Platform Admin Console</span>
          </button>
        </div>

        {/* Demo Switch User Quick Bar */}
        <div className="p-3 bg-slate-50/70 dark:bg-slate-900/40">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ArrowRightLeft className="w-3 h-3" />
            Switch Demo Account
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                switchUser('user-admin');
                onClose();
              }}
              className={`text-xs px-2.5 py-1.5 rounded-lg border text-left font-medium truncate ${
                user?.id === 'user-admin'
                  ? 'border-brand-violet bg-brand-violet/10 text-brand-violet font-semibold'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              👑 Alexander (Admin)
            </button>
            <button
              onClick={() => {
                switchUser('user-member');
                onClose();
              }}
              className={`text-xs px-2.5 py-1.5 rounded-lg border text-left font-medium truncate ${
                user?.id === 'user-member'
                  ? 'border-brand-violet bg-brand-violet/10 text-brand-violet font-semibold'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              👩‍💻 Sophia (Member)
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="p-1.5">
          <button
            onClick={() => {
              logout();
              navigate('/login');
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left font-medium text-sm"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
