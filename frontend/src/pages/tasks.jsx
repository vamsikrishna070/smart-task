import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { setTasks, removeTask, updateTask } from '../store/tasksSlice.js';
import { Card } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Trash2, Edit2, CheckCircle, Circle, Clock, Tag, Flag, AlertTriangle, Calendar, Plus } from 'lucide-react';

export default function Tasks() {
  const [, setLocation] = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const tasks = useSelector((state) => state.tasks.tasks);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
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

  const getPriorityInfo = (score) => {
    if (score >= 95) return { label: 'CRITICAL', color: 'rose', icon: AlertTriangle };
    if (score >= 85) return { label: 'HIGH', color: 'orange', icon: Flag };
    if (score >= 70) return { label: 'MEDIUM', color: 'amber', icon: Clock };
    return { label: 'LOW', color: 'emerald', icon: Tag };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-slate-200 rounded-full" />
          <div className="h-4 w-32 bg-slate-200 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">
            <span className="text-gradient">My Workflow</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">Organize your day with precision</p>
        </div>
        <Button
          onClick={() => setLocation('/tasks/new')}
          className="bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 py-7 px-10 rounded-3xl text-lg font-bold transition-all hover:scale-105 active:scale-95 group"
        >
          <Plus className="mr-2 group-hover:rotate-90 transition-transform" />
          New Mission
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Filters */}
        <Card className="glass p-2 border-none inline-flex flex-col md:flex-row gap-2">
          {['all', 'pending', 'in progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                filter === status
                  ? 'bg-white text-blue-600 shadow-md scale-105'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
              }`}
            >
              {status}
            </button>
          ))}
        </Card>
      </div>

      {filteredTasks.length === 0 ? (
        <Card className="glass p-32 text-center border-none">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-300 animate-float">
              <Calendar size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-900">All Clear!</h3>
            <p className="text-slate-500 text-lg">No tasks found for this filter. Time to dream big or enjoy the quiet.</p>
            <Button onClick={() => setLocation('/tasks/new')} variant="outline" className="mt-8 py-6 px-10 rounded-2xl font-bold border-2">
              Begin New Task
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredTasks.map((task) => {
            const p = getPriorityInfo(task.priorityScore);
            return (
              <Card
                key={task.id}
                className={`glass p-8 border-none group relative overflow-hidden transition-all duration-500 hover:bg-white/90 ${
                  task.status === 'Completed' ? 'opacity-60 grayscale-[0.5]' : ''
                }`}
              >
                {/* Priority Indicator Line */}
                <div className={`absolute top-0 left-0 w-2 h-full bg-${p.color}-500`} />
                
                {task.priorityScore >= 95 && task.status !== 'Completed' && (
                  <div className="absolute top-0 right-0 px-6 py-2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-3xl shadow-xl z-10 animate-pulse">
                    Immediate Action
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className="mt-2 transition-all hover:scale-125 active:scale-90"
                  >
                    {task.status === 'Completed' ? (
                      <CheckCircle size={40} className="text-emerald-500 fill-emerald-50" />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl border-4 border-slate-200 hover:border-blue-500 transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                      <h3
                        className={`text-2xl font-black tracking-tight truncate ${
                          task.status === 'Completed'
                            ? 'line-through text-slate-400'
                            : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl bg-${p.color}-50 text-${p.color}-600 border border-${p.color}-100`}>
                        <p.icon size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {p.label} • {task.priorityScore.toFixed(0)}
                        </span>
                      </div>
                    </div>
                    
                    <p className={`text-slate-500 text-lg line-clamp-2 mb-6 leading-relaxed ${task.status === 'Completed' ? 'line-through' : ''}`}>
                      {task.description || 'Elevate this task by adding a detailed description of your goals.'}
                    </p>

                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="flex items-center gap-2.5 px-5 py-2 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest">
                        <Tag size={14} />
                        {task.category}
                      </div>
                      
                      <div className={`flex items-center gap-2.5 text-sm font-bold ${task.isOverdue && task.status !== 'Completed' ? 'text-rose-600' : 'text-slate-400'}`}>
                        <Clock size={18} />
                        {task.deadline ? new Date(task.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'No Deadline Set'}
                        {task.isOverdue && task.status !== 'Completed' && (
                          <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-lg text-[10px] uppercase font-black ml-2 shadow-sm">Overdue</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <button
                      onClick={() => setLocation(`/tasks/${task.id}/edit`)}
                      className="p-4 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm"
                      title="Edit Goal"
                    >
                      <Edit2 size={24} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-4 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-sm"
                      title="Delete Goal"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
