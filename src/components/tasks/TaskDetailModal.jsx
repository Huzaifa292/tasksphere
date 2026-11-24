import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { formatDate, timeAgo, isTaskOverdue } from '../../utils/dateUtils';
import { useTaskStore } from '../../store/taskStore';
import { useProjectStore } from '../../store/projectStore';
import { useTeamStore } from '../../store/teamStore';
import { useAuthStore } from '../../store/authStore';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Send,
  User,
  Paperclip,
  Tag,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TaskDetailModal = ({ isOpen, onClose, taskId, onEdit }) => {
  const tasks = useTaskStore(state => state.tasks);
  const updateTask = useTaskStore(state => state.updateTask);
  const updateTaskStatus = useTaskStore(state => state.updateTaskStatus);
  const addSubtask = useTaskStore(state => state.addSubtask);
  const toggleSubtask = useTaskStore(state => state.toggleSubtask);
  const deleteSubtask = useTaskStore(state => state.deleteSubtask);
  const addComment = useTaskStore(state => state.addComment);
  const deleteTask = useTaskStore(state => state.deleteTask);

  const projects = useProjectStore(state => state.projects);
  const team = useTeamStore(state => state.members);
  const user = useAuthStore(state => state.user);

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [commentText, setCommentText] = useState('');

  const task = tasks.find(t => t.id === taskId);
  if (!task) return null;

  const project = projects.find(p => p.id === task.projectId);
  const assignee = team.find(m => m.id === task.assigneeId);
  const creator = team.find(m => m.id === task.createdById);
  const overdue = isTaskOverdue(task.dueDate, task.status);

  const handleStatusChange = (newStatus) => {
    updateTaskStatus(task.id, newStatus);
    if (newStatus === 'Done') {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleAddSubtaskSubmit = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const handleAddCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, {
      userId: user?.id || 'user-admin',
      text: commentText.trim()
    });
    setCommentText('');
  };

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.completed).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400">
              {project?.name || 'Workspace'}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Badge variant={task.priority} size="xs">
              {task.priority} Priority
            </Badge>
            {overdue && (
              <Badge variant="Critical" size="xs">
                Overdue
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Status Selector Dropdown */}
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            >
              <option value="Backlog">Backlog</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Done">Done</option>
            </select>

            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              Edit
            </Button>
            <Button
              size="xs"
              variant="danger"
              onClick={() => {
                if (window.confirm('Delete this task?')) {
                  deleteTask(task.id);
                  onClose();
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
            {task.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 whitespace-pre-wrap leading-relaxed">
            {task.description || 'No description provided.'}
          </p>
        </div>

        {/* Metadata Panel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Assignee</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Avatar src={assignee?.avatar} name={assignee?.name} size="xs" />
              <span className="font-bold text-slate-800 dark:text-white truncate">
                {assignee?.name || 'Unassigned'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Due Date</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-800 dark:text-white">
              <Calendar className="w-3.5 h-3.5 text-brand-violet" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Estimated Time</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-800 dark:text-white">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>{task.estimatedHours || 0}h</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Tags</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {(task.tags || []).map((t, idx) => (
                <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-brand-violet/10 text-brand-violet font-semibold">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Subtasks Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Subtasks ({completedSubtasks}/{subtasks.length})
            </h4>
            {subtasks.length > 0 && (
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                {Math.round((completedSubtasks / subtasks.length) * 100)}%
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            {subtasks.map(s => (
              <div
                key={s.id}
                className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-brand-indigo border border-slate-100 dark:border-slate-800 hover:border-slate-300 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleSubtask(task.id, s.id)}
                  className="flex items-center gap-2.5 text-left text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  {s.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                  <span className={s.completed ? 'line-through text-slate-400' : ''}>
                    {s.title}
                  </span>
                </button>
                <button
                  onClick={() => deleteSubtask(task.id, s.id)}
                  className="text-slate-300 hover:text-rose-500 text-xs px-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Add Subtask Form */}
          <form onSubmit={handleAddSubtaskSubmit} className="mt-2 flex gap-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Add checklist item..."
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            />
            <Button type="submit" size="xs" variant="primary" icon={Plus}>
              Add
            </Button>
          </form>
        </div>

        {/* Comments & Discussion */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Comments & Activity ({task.comments?.length || 0})
          </h4>

          <div className="space-y-3 max-h-48 overflow-y-auto mb-3">
            {(task.comments || []).length === 0 ? (
              <p className="text-xs text-slate-400 italic">No comments yet. Start the conversation!</p>
            ) : (
              (task.comments || []).map(c => {
                const author = team.find(m => m.id === c.userId);
                return (
                  <div key={c.id} className="flex gap-2.5 text-xs">
                    <Avatar src={author?.avatar} name={author?.name} size="xs" />
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 dark:text-white">{author?.name || 'Alexander Wright'}</span>
                        <span className="text-[10px] text-slate-400">{timeAgo(c.createdAt)}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{c.text}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleAddCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment or mention @team..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            />
            <Button type="submit" size="sm" variant="primary" icon={Send}>
              Post
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};
