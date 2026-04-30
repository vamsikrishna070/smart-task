import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { setTasks, removeTask, updateTask } from '../store/tasksSlice.js';
import { Card } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Trash2, Edit2, CheckCircle, Circle } from 'lucide-react';

export default function Tasks() {
  const [, setLocation] = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const tasks = useSelector((state) => state.tasks.tasks);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    // No polling interval needed thanks to Socket.io
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(setTasks(data));
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        dispatch(removeTask(taskId));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        const updatedTask = await response.json();
        dispatch(updateTask(updatedTask));
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const filteredTasks =
    filter === 'all'
      ? tasks
      : tasks.filter((task) => task.status.toLowerCase() === filter.toLowerCase());

  const getPriorityStyles = (priority) => {
    if (priority >= 95) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (priority >= 85) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (priority >= 70) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="text-gradient">Tasks</span>
          </h1>
          <p className="text-slate-500 font-medium">Manage and prioritize your workflow</p>
        </div>
        <Button
          onClick={() => setLocation('/tasks/new')}
          className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 py-6 px-8 rounded-2xl text-lg font-bold transition-all hover:scale-105 active:scale-95"
        >
          + Create Task
        </Button>
      </div>

      <Card className="glass p-2 border-none inline-flex gap-1">
        {['all', 'pending', 'in progress', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              filter === status
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </Card>

      {filteredTasks.length === 0 ? (
        <Card className="glass p-20 text-center border-none">
          <div className="max-w-xs mx-auto space-y-4">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Circle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No tasks found</h3>
            <p className="text-slate-500">Time to add some goals and boost your productivity!</p>
            <Button onClick={() => setLocation('/tasks/new')} variant="outline" className="mt-4">
              Create your first task
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTasks
            .sort((a, b) => b.priorityScore - a.priorityScore)
            .map((task) => (
              <Card
                key={task.id}
                className={`glass card-hover p-6 border-none group relative overflow-hidden ${
                  task.status === 'Completed' ? 'opacity-75' : ''
                }`}
              >
                {task.priorityScore >= 95 && task.status !== 'Completed' && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-bl-xl shadow-sm">
                    High Priority
                  </div>
                )}
                
                <div className="flex items-start gap-5">
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className="mt-1 transition-transform hover:scale-110 active:scale-90"
                  >
                    {task.status === 'Completed' ? (
                      <CheckCircle size={28} className="text-emerald-500 fill-emerald-50" />
                    ) : (
                      <Circle size={28} className="text-slate-300 hover:text-blue-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3
                        className={`text-xl font-bold tracking-tight truncate ${
                          task.status === 'Completed'
                            ? 'line-through text-slate-400'
                            : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-lg border ${getPriorityStyles(
                          task.priorityScore
                        )}`}
                      >
                        Score: {task.priorityScore.toFixed(0)}
                      </span>
                    </div>
                    
                    <p className={`text-slate-500 line-clamp-2 mb-4 leading-relaxed ${task.status === 'Completed' ? 'line-through' : ''}`}>
                      {task.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {task.category}
                      </div>
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${task.isOverdue && task.status !== 'Completed' ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                        <Clock size={14} />
                        {task.deadline ? new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline'}
                        {task.isOverdue && task.status !== 'Completed' && ' (Overdue)'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setLocation(`/tasks/${task.id}/edit`)}
                      className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Edit Task"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
