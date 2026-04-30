export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getPriorityLevel = (score) => {
  if (score >= 95) return 'Critical';
  if (score >= 85) return 'High';
  if (score >= 70) return 'Medium';
  return 'Low';
};

export const getPriorityColor = (score) => {
  if (score >= 95) return '#dc2626'; // red
  if (score >= 85) return '#ea580c'; // orange
  if (score >= 70) return '#eab308'; // yellow
  return '#16a34a'; // green
};

export const getTaskColor = (status) => {
  switch (status) {
    case 'Completed':
      return '#10b981'; // green
    case 'In Progress':
      return '#f59e0b'; // amber
    case 'Pending':
      return '#6366f1'; // indigo
    default:
      return '#6b7280'; // gray
  }
};

export const isOverdue = (deadline) => {
  return new Date(deadline) < new Date() && new Date().getHours() > 0;
};

export const daysUntilDeadline = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const calculateTaskDuration = (createdAt, completedAt) => {
  const start = new Date(createdAt);
  const end = new Date(completedAt || new Date());
  const diffMs = end - start;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) return `${diffMins}m`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
  return `${Math.floor(diffMins / 1440)}d`;
};
