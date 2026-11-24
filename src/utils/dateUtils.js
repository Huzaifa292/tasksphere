import { format, formatDistanceToNow, isAfter, isBefore, parseISO, startOfDay } from 'date-fns';

export const formatDate = (dateString, formatStr = 'MMM d, yyyy') => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch (e) {
    return dateString;
  }
};

export const formatTime = (seconds) => {
  if (!seconds || seconds <= 0) return '00:00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatHoursShort = (hours) => {
  if (!hours) return '0h';
  const rounded = Math.round(hours * 10) / 10;
  return `${rounded}h`;
};

export const timeAgo = (dateString) => {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (e) {
    return dateString;
  }
};

export const isTaskOverdue = (dueDate, status) => {
  if (!dueDate || status === 'Done' || status === 'Completed') return false;
  try {
    const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    return isBefore(due, startOfDay(new Date()));
  } catch (e) {
    return false;
  }
};

export const isUpcomingSoon = (dueDate, days = 3) => {
  if (!dueDate) return false;
  try {
    const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    const today = startOfDay(new Date());
    const limit = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    return isAfter(due, today) && isBefore(due, limit);
  } catch (e) {
    return false;
  }
};
