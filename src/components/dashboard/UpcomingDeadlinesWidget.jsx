import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Calendar, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { formatDate, isTaskOverdue, isUpcomingSoon } from '../../utils/dateUtils';
import { useTaskStore } from '../../store/taskStore';
import { useTeamStore } from '../../store/teamStore';
import { useNavigate } from 'react-router-dom';

export const UpcomingDeadlinesWidget = () => {
  const navigate = useNavigate();
  const tasks = useTaskStore(state => state.tasks);
  const team = useTeamStore(state => state.members);

  // Filter tasks with deadlines
  const upcomingTasks = tasks
    .filter(t => t.status !== 'Done' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-violet" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
            Upcoming Deadlines
          </h3>
        </div>
        <button
          onClick={() => navigate('/calendar')}
          className="text-xs font-semibold text-brand-violet hover:underline flex items-center gap-1"
        >
          View Calendar
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {upcomingTasks.map(task => {
          const assignee = team.find(m => m.id === task.assigneeId);
          const overdue = isTaskOverdue(task.dueDate, task.status);

          return (
            <div
              key={task.id}
              onClick={() => navigate('/tasks')}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 px-2 rounded-xl cursor-pointer transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold truncate ${overdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {task.title}
                  </span>
                  {overdue && (
                    <Badge variant="Critical" size="xs">
                      Overdue
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(task.dueDate)}
                  </span>
                  <span>·</span>
                  <Badge variant={task.status} size="xs">
                    {task.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={task.priority} size="xs">
                  {task.priority}
                </Badge>
                {assignee && (
                  <Avatar src={assignee.avatar} name={assignee.name} size="xs" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
