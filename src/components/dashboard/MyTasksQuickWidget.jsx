import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CheckSquare, ArrowRight, Circle, CheckCircle } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export const MyTasksQuickWidget = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const tasks = useTaskStore(state => state.tasks);
  const updateTaskStatus = useTaskStore(state => state.updateTaskStatus);

  const myTasks = tasks
    .filter(t => t.assigneeId === user?.id && t.status !== 'Done')
    .slice(0, 5);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-brand-violet" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
            My Focus Tasks ({myTasks.length})
          </h3>
        </div>
        <button
          onClick={() => navigate('/my-work')}
          className="text-xs font-semibold text-brand-violet hover:underline flex items-center gap-1"
        >
          My Work Hub
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {myTasks.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-xs">
          🎉 All your assigned tasks are completed!
        </div>
      ) : (
        <div className="space-y-2">
          {myTasks.map(task => (
            <div
              key={task.id}
              className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex items-center justify-between gap-3 group transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => updateTaskStatus(task.id, 'Done')}
                  title="Mark as completed"
                  className="text-slate-300 hover:text-emerald-500 transition-colors"
                >
                  <Circle className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-violet transition-colors">
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={task.priority} size="xs">
                  {task.priority}
                </Badge>
                <Badge variant={task.status} size="xs">
                  {task.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
