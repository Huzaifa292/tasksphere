import React, { useState, useMemo } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useTeamStore } from '../../store/teamStore';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { ProjectListRow } from '../../components/projects/ProjectListRow';
import { ProjectModal } from '../../components/projects/ProjectModal';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Filter,
  FolderPlus,
  ArrowUpDown
} from 'lucide-react';

export const ProjectsPage = () => {
  const projects = useProjectStore(state => state.projects);
  const addProject = useProjectStore(state => state.addProject);
  const updateProject = useProjectStore(state => state.updateProject);
  const deleteProject = useProjectStore(state => state.deleteProject);
  const archiveProject = useProjectStore(state => state.archiveProject);
  const duplicateProject = useProjectStore(state => state.duplicateProject);
  const team = useTeamStore(state => state.members);

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [memberFilter, setMemberFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' | 'name' | 'progress'

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Filtered & Sorted projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || p.priority === priorityFilter;
        const matchesMember = memberFilter === 'All' || (p.members && p.members.includes(memberFilter));

        return matchesSearch && matchesStatus && matchesPriority && matchesMember;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'progress') return (b.progress || 0) - (a.progress || 0);
        return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      });
  }, [projects, search, statusFilter, priorityFilter, memberFilter, sortBy]);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleSaveProject = (formData) => {
    if (editingProject) {
      updateProject(editingProject.id, formData);
    } else {
      addProject(formData);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Projects Portfolio
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage, organize, and monitor all company strategic initiatives ({projects.length} total)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleOpenCreate}
            icon={Plus}
            variant="primary"
            className="shadow-sm"
          >
            New Project
          </Button>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-brand-indigo border border-slate-200/80 dark:border-brand-darkBorder shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name, category, or tag..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          />
        </div>

        {/* Filters & View Switch */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          >
            <option value="All">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Member Filter */}
          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          >
            <option value="All">All Members</option>
            {team.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="name">Sort by Name</option>
            <option value="progress">Sort by Progress</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-brand-indigo text-brand-violet shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-brand-indigo text-brand-violet shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderPlus}
          title="No projects match criteria"
          description="Try adjusting your filters or search keywords, or create a new project initiative."
          actionLabel="Create New Project"
          onAction={handleOpenCreate}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleOpenEdit}
              onDelete={deleteProject}
              onDuplicate={duplicateProject}
              onArchive={archiveProject}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 dark:border-brand-darkBorder bg-white dark:bg-brand-indigo overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/60 dark:bg-slate-900/30">
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(project => (
                  <ProjectListRow
                    key={project.id}
                    project={project}
                    onEdit={handleOpenEdit}
                    onDelete={deleteProject}
                    onDuplicate={duplicateProject}
                    onArchive={archiveProject}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProject}
        project={editingProject}
      />
    </div>
  );
};
