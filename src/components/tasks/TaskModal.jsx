import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useProjectStore } from '../../store/projectStore';
import { useTeamStore } from '../../store/teamStore';
import { useAuthStore } from '../../store/authStore';

export const TaskModal = ({ isOpen, onClose, onSave, task = null, initialStatus = 'To Do' }) => {
  const projects = useProjectStore(state => state.projects);
  const team = useTeamStore(state => state.members);
  const user = useAuthStore(state => state.user);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || 'proj-1');
  const [assigneeId, setAssigneeId] = useState('user-member');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState(initialStatus);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('8');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['Frontend']);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setProjectId(task.projectId || projects[0]?.id || 'proj-1');
      setAssigneeId(task.assigneeId || 'user-member');
      setPriority(task.priority || 'Medium');
      setStatus(task.status || 'To Do');
      setStartDate(task.startDate || '');
      setDueDate(task.dueDate || '');
      setEstimatedHours(task.estimatedHours?.toString() || '8');
      setTags(task.tags || []);
    } else {
      setTitle('');
      setDescription('');
      setProjectId(projects[0]?.id || 'proj-1');
      setAssigneeId('user-member');
      setPriority('Medium');
      setStatus(initialStatus);
      setStartDate(new Date().toISOString().split('T')[0]);
      setDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setEstimatedHours('8');
      setTags(['Sprint', 'Core']);
    }
  }, [task, isOpen, initialStatus, projects]);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      projectId,
      assigneeId,
      createdById: task?.createdById || user?.id || 'user-admin',
      priority,
      status,
      startDate,
      dueDate,
      estimatedHours: parseFloat(estimatedHours) || 0,
      tags
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create Task'}
      subtitle="Define deliverables, assignee, due date, and priority level"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Optimize Lighthouse web vitals metrics"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Technical details, acceptance criteria, steps to reproduce..."
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Project *
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            >
              <option value="Backlog">Backlog</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            >
              {team.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Estimated Hours
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Tags (press Enter to add)
          </label>
          <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo">
            {tags.map((t, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md text-xs bg-brand-violet/10 text-brand-violet font-semibold flex items-center gap-1">
                {t}
                <button type="button" onClick={() => removeTag(t)} className="hover:text-rose-500">×</button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="text-xs bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
