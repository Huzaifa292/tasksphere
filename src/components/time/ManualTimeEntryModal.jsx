import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useProjectStore } from '../../store/projectStore';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';

export const ManualTimeEntryModal = ({ isOpen, onClose, onSave }) => {
  const projects = useProjectStore(state => state.projects);
  const tasks = useTaskStore(state => state.tasks);
  const user = useAuthStore(state => state.user);

  const [projectId, setProjectId] = useState(projects[0]?.id || 'proj-1');
  const [taskId, setTaskId] = useState('');
  const [hours, setHours] = useState('2');
  const [minutes, setMinutes] = useState('30');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [billable, setBillable] = useState(true);

  const projectTasks = tasks.filter(t => t.projectId === projectId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const durationSeconds = (parseFloat(hours) || 0) * 3600 + (parseFloat(minutes) || 0) * 60;
    if (durationSeconds <= 0) return;

    onSave({
      projectId,
      taskId: taskId || null,
      userId: user?.id || 'user-admin',
      description: description.trim() || 'Manual time record',
      date,
      durationSeconds,
      billable
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manual Time Log"
      subtitle="Record time spent working on a specific sprint task or project"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Project *
          </label>
          <select
            value={projectId}
            onChange={(e) => {
              setProjectId(e.target.value);
              setTaskId('');
            }}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Related Task (Optional)
          </label>
          <select
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          >
            <option value="">General Project Work</option>
            {projectTasks.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details of deliverables completed..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Hours
            </label>
            <input
              type="number"
              min="0"
              max="24"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Minutes
            </label>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={billable}
              onChange={(e) => setBillable(e.target.checked)}
              className="w-4 h-4 rounded text-brand-violet"
            />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Billable to client</span>
          </label>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Log Time</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
