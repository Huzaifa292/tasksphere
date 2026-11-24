import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Trash2, ExternalLink } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../utils/dateUtils';

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const notifications = useNotificationStore(state => state.notifications);
  const markAsRead = useNotificationStore(state => state.markAsRead);
  const markAllAsRead = useNotificationStore(state => state.markAllAsRead);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-brand-indigo rounded-2xl shadow-2xl border border-slate-200/80 dark:border-brand-darkBorder z-50 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm font-heading">
              Notifications
            </h4>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-violet text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="text-xs text-brand-violet hover:underline flex items-center gap-1 font-medium"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No notifications yet
            </div>
          ) : (
            notifications.slice(0, 6).map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markAsRead(notif.id);
                  if (notif.projectId) navigate(`/projects/${notif.projectId}`);
                  else if (notif.taskId) navigate('/tasks');
                  onClose();
                }}
                className={`p-3.5 text-left transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 flex gap-3 ${
                  !notif.read ? 'bg-brand-violet/5 dark:bg-brand-violet/10' : ''
                }`}
              >
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-brand-violet" style={{ opacity: notif.read ? 0 : 1 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                    {notif.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {timeAgo(notif.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={() => {
              navigate('/notifications');
              onClose();
            }}
            className="text-xs font-semibold text-brand-violet hover:underline inline-flex items-center gap-1"
          >
            View all notifications
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
