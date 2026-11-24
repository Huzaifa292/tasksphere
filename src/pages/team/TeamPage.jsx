import React, { useState, useMemo } from 'react';
import { useTeamStore } from '../../store/teamStore';
import { useTaskStore } from '../../store/taskStore';
import { useProjectStore } from '../../store/projectStore';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { MemberModal } from '../../components/team/MemberModal';
import { calculateTeamWorkload } from '../../utils/calculations';
import {
  UserPlus,
  Search,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Briefcase
} from 'lucide-react';

export const TeamPage = () => {
  const team = useTeamStore(state => state.members);
  const addMember = useTeamStore(state => state.addMember);
  const updateMember = useTeamStore(state => state.updateMember);
  const removeMember = useTeamStore(state => state.removeMember);

  const tasks = useTaskStore(state => state.tasks);
  const projects = useProjectStore(state => state.projects);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedMemberDetail, setSelectedMemberDetail] = useState(null);

  // Workload metrics calculated per member
  const workloads = useMemo(() => {
    return calculateTeamWorkload(tasks, team);
  }, [tasks, team]);

  const filteredMembers = useMemo(() => {
    return workloads.filter(({ member }) => {
      const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase()) ||
        member.jobTitle.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === 'All' || member.role === roleFilter;
      const matchesDept = departmentFilter === 'All' || member.department === departmentFilter;

      return matchesSearch && matchesRole && matchesDept;
    });
  }, [workloads, search, roleFilter, departmentFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Team & People Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage contributors, cross-functional roles, and live sprint capacity workloads ({team.length} members)
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingMember(null);
            setModalOpen(true);
          }}
          icon={UserPlus}
          variant="primary"
          className="shadow-sm"
        >
          Invite Member
        </Button>
      </div>

      {/* Role explanation disclaimer banner */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-violet flex-shrink-0" />
          <span>
            <strong className="font-bold text-slate-800 dark:text-white">Role-Based Access Simulation:</strong> Roles (Admin, Project Manager, Team Member, Viewer) control frontend UI interactions for demonstration purposes.
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-brand-indigo border border-slate-200/80 dark:border-brand-darkBorder shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or job title..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Team Member">Team Member</option>
            <option value="Viewer">Viewer</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
            <option value="Quality Assurance">Quality Assurance</option>
          </select>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(({ member, activeTasksCount, completedTasksCount, capacityPercentage, estimatedHours }) => {
          const memberProjects = projects.filter(p => (p.members || []).includes(member.id));

          return (
            <Card
              key={member.id}
              hover
              className="flex flex-col justify-between group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={member.avatar} name={member.name} size="lg" status="online" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-violet transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {member.jobTitle}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {member.department}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Badge variant={member.role === 'Admin' ? 'primary' : 'default'} size="xs">
                      {member.role}
                    </Badge>
                    <button
                      onClick={() => {
                        setEditingMember(member);
                        setModalOpen(true);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {member.role !== 'Admin' && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove ${member.name}?`)) {
                            removeMember(member.id);
                          }
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-500"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Contact metadata */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1.5">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.location && (
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{member.location}</span>
                    </div>
                  )}
                </div>

                {/* Assigned projects tags */}
                {memberProjects.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {memberProjects.slice(0, 2).map(p => (
                      <span
                        key={p.id}
                        className="text-[10px] font-bold px-2 py-0.5 rounded truncate max-w-[130px]"
                        style={{
                          backgroundColor: `${p.color || '#7867F7'}15`,
                          color: p.color || '#7867F7'
                        }}
                      >
                        {p.name}
                      </span>
                    ))}
                    {memberProjects.length > 2 && (
                      <span className="text-[10px] text-slate-400 font-bold px-1 self-center">
                        +{memberProjects.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Workload Capacity Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-500">
                    Sprint Capacity ({activeTasksCount} active tasks)
                  </span>
                  <span className={`font-bold font-mono ${
                    capacityPercentage > 85 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {capacityPercentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      capacityPercentage > 85
                        ? 'bg-rose-500'
                        : capacityPercentage > 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${capacityPercentage}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Member Modal */}
      <MemberModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        member={editingMember}
        onSave={(data) => {
          if (editingMember) updateMember(editingMember.id, data);
          else addMember(data);
        }}
      />
    </div>
  );
};
