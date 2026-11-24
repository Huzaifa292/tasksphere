import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import { useTaskStore } from '../../store/taskStore';
import { useTeamStore } from '../../store/teamStore';
import { calculateProjectProgress } from '../../utils/calculations';
import { formatDate } from '../../utils/dateUtils';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ProjectModal } from '../../components/projects/ProjectModal';
import {
  ArrowLeft,
  Calendar,
  CheckSquare,
  Users,
  Edit2,
  Trash2,
  Columns3,
  List,
  FileText,
  Activity,
  Plus,
  DollarSign,
  Clock,
  ExternalLink
} from 'lucide-react';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const projects = useProjectStore(state => state.projects);
  const updateProject = useProjectStore(state => state.updateProject);
  const deleteProject = useProjectStore(state => state.deleteProject);
  const tasks = useTaskStore(state => state.tasks);
  const addTask = useTaskStore(state => state.addTask);
  const updateTaskStatus = useTaskStore(state => state.updateTaskStatus);
  const team = useTeamStore(state => state.members);

  const [activeTab, setActiveTab] = useState('Overview'); // 'Overview' | 'Board' | 'List' | 'Calendar' | 'Files' | 'Activity'
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Project not found</h3>
        <Button className="mt-4" onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const completedTasks = projectTasks.filter(t => t.status === 'Done');
  const progress = calculateProjectProgress(project.id, tasks);
  const manager = team.find(m => m.id === project.managerId);
  const assignedMembers = team.filter(m => (project.members || []).includes(m.id));

  const handleQuickAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      projectId: project.id,
      priority: 'Medium',
      status: 'To Do',
      dueDate: project.dueDate || new Date().toISOString().split('T')[0]
    });
    setNewTaskTitle('');
  };

  const tabs = ['Overview', 'List', 'Board', 'Files', 'Activity'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Back button & Action controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-violet transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects Portfolio
        </button>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={Edit2}
            onClick={() => setEditModalOpen(true)}
          >
            Edit Project
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={Trash2}
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${project.name}?`)) {
                deleteProject(project.id);
                navigate('/projects');
              }
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-brand-darkBorder bg-white dark:bg-brand-indigo shadow-premium">
        {project.coverImage && (
          <div className="h-44 sm:h-52 w-full relative overflow-hidden bg-slate-900">
            <img
              src={project.coverImage}
              alt={project.name}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        )}

        <div className="p-6 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={project.status} size="sm">
                  {project.status}
                </Badge>
                <Badge variant={project.priority} size="sm">
                  {project.priority} Priority
                </Badge>
                <span className="text-xs text-slate-400 font-semibold uppercase">
                  {project.category}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                {project.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/60 flex-shrink-0">
              <div className="text-center px-2">
                <span className="text-xs text-slate-400 uppercase font-bold block">Progress</span>
                <span className="text-2xl font-black text-brand-violet font-heading">{progress}%</span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <div className="text-center px-2">
                <span className="text-xs text-slate-400 uppercase font-bold block">Tasks Done</span>
                <span className="text-xl font-bold text-slate-800 dark:text-white">
                  {completedTasks.length}/{projectTasks.length}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Timeline</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {formatDate(project.startDate)} – {formatDate(project.dueDate)}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Project Manager</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Avatar src={manager?.avatar} name={manager?.name} size="xs" />
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                  {manager?.name || 'Alexander Wright'}
                </span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Allocated Budget</span>
              <p className="font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                {project.budget || '$50,000'}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Assigned Team</span>
              <div className="flex -space-x-1.5 overflow-hidden mt-0.5">
                {assignedMembers.map(m => (
                  <Avatar key={m.id} src={m.avatar} name={m.name} size="xs" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-brand-violet text-brand-violet'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white font-heading mb-3">
                Project Milestone Roadmap
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">Phase 1: Architecture & Scaffolding</h5>
                    <p className="text-xs text-slate-500">Design specs approved and infrastructure repository initialized.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-violet text-white flex items-center justify-center text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">Phase 2: Sprint Feature Delivery (Active)</h5>
                    <p className="text-xs text-slate-500">Core interactions, responsive UI components, and state integration.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center text-xs font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-500">Phase 3: QA Verification & Production Release</h5>
                    <p className="text-xs text-slate-400">Security audit, performance testing, and stakeholder handover.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Task Adder */}
            <Card>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white font-heading mb-3">
                Add Task to this Project
              </h4>
              <form onSubmit={handleQuickAddTask} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
                />
                <Button type="submit" size="sm" variant="primary" icon={Plus}>
                  Add
                </Button>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white font-heading mb-3">
                Assigned Team Members ({assignedMembers.length})
              </h4>
              <div className="space-y-3">
                {assignedMembers.map(m => (
                  <div key={m.id} className="flex items-center gap-3">
                    <Avatar src={m.avatar} name={m.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{m.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{m.jobTitle}</p>
                    </div>
                    <Badge variant={m.role === 'Admin' ? 'primary' : 'default'} size="xs">
                      {m.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'List' && (
        <Card padding="p-0" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 font-bold uppercase text-[10px] text-slate-400">
                <tr>
                  <th className="py-3 px-4">Task</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {projectTasks.map(task => {
                  const assignee = team.find(m => m.id === task.assigneeId);
                  return (
                    <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {task.title}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={task.status} size="xs">
                          {task.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={task.priority} size="xs">
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {assignee ? (
                          <div className="flex items-center gap-1.5">
                            <Avatar src={assignee.avatar} name={assignee.name} size="xs" />
                            <span>{assignee.name}</span>
                          </div>
                        ) : 'Unassigned'}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {formatDate(task.dueDate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'Board' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-brand-indigo border border-slate-200/80 dark:border-brand-darkBorder text-center py-12">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
            Interactive Kanban board for {project.name}
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Jump to the dedicated full-screen Kanban workflow workspace to drag and drop tasks across columns.
          </p>
          <Button variant="primary" icon={Columns3} onClick={() => navigate('/board')}>
            Go to Kanban Board
          </Button>
        </div>
      )}

      {activeTab === 'Files' && (
        <Card>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white font-heading mb-4">
            Project Deliverable Assets & Specs
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: 'Architecture_System_Spec_v2.pdf', size: '3.4 MB', date: 'Oct 28' },
              { name: 'Figma_UI_Kit_Export.tokens.json', size: '420 KB', date: 'Nov 02' },
              { name: 'Security_Audit_Evidence_Checklist.xlsx', size: '1.2 MB', date: 'Nov 14' },
              { name: 'SaaS_Release_Presentation.key', size: '18.9 MB', date: 'Nov 18' },
            ].map((file, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-violet/40 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-5 h-5 text-brand-violet flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{file.size} · {file.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'Activity' && (
        <Card>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white font-heading mb-4">
            Project Audit Trail
          </h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-500">2 hours ago:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Sophia Chen moved "Refactor Kanban drag-and-drop mechanics" to In Progress
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-slate-500">Yesterday:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Elena Rostova uploaded latest responsive navbar tokens
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-violet" />
              <span className="text-slate-500">3 days ago:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Alexander Wright adjusted project milestone target to Dec 15
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <ProjectModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={(data) => updateProject(project.id, data)}
        project={project}
      />
    </div>
  );
};
