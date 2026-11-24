export const calculateProjectProgress = (projectId, tasks = []) => {
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  if (projectTasks.length === 0) return 0;
  const doneTasks = projectTasks.filter(t => t.status === 'Done');
  return Math.round((doneTasks.length / projectTasks.length) * 100);
};

export const calculateTaskCounts = (tasks = []) => {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'Done').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const inReview = tasks.filter(t => t.status === 'In Review').length;
  const todo = tasks.filter(t => t.status === 'To Do').length;
  const backlog = tasks.filter(t => t.status === 'Backlog').length;
  const pending = total - done;

  const now = new Date();
  const overdue = tasks.filter(t => {
    if (t.status === 'Done' || !t.dueDate) return false;
    return new Date(t.dueDate) < now;
  }).length;

  return { total, done, inProgress, inReview, todo, backlog, pending, overdue };
};

export const calculateTeamWorkload = (tasks = [], teamMembers = []) => {
  return teamMembers.map(member => {
    const assignedTasks = tasks.filter(t => t.assigneeId === member.id && t.status !== 'Done');
    const completedTasks = tasks.filter(t => t.assigneeId === member.id && t.status === 'Done');
    const overdueTasks = tasks.filter(t => {
      if (t.assigneeId !== member.id || t.status === 'Done' || !t.dueDate) return false;
      return new Date(t.dueDate) < new Date();
    });

    const estimatedHours = assignedTasks.reduce((sum, t) => sum + (parseFloat(t.estimatedHours) || 0), 0);

    return {
      member,
      activeTasksCount: assignedTasks.length,
      completedTasksCount: completedTasks.length,
      overdueTasksCount: overdueTasks.length,
      estimatedHours,
      capacityPercentage: Math.min(Math.round((assignedTasks.length / 8) * 100), 100) // normalized max ~8 tasks
    };
  });
};
