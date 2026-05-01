import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { setTasks, removeTask, updateTask } from '../store/tasksSlice.js';
import { Card } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Trash2, Edit2, CheckCircle, Circle, Clock, Tag, Flag, AlertTriangle, Calendar, Plus } from 'lucide-react';
import { getApiUrl } from '../lib/api.js';

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
      const response = await fetch(getApiUrl('/api/tasks'), {
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
      const response = await fetch(getApiUrl(`/api/tasks/${taskId}`), {
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
      const response = await fetch(getApiUrl(`/api/tasks/${task.id}`), {
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
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl" />
          <div className="h-4 w-40 bg-slate-100 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-12 pb-12">
      {/* Dynamic Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 animate-enter">
        <div className="space-y-2">
          <div className="px-3 py-1 bg-slate-900 text-white inline-block rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-2">
            Operations
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-black tracking-tight text-slate-900 leading-none">
            Strategic <br/>
            <span className="text-blue-600">Workflow.</span>
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-slate-500 font-medium">Manage your execution with high-fidelity tracking.</p>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
           <Button
            onClick={() => setLocation('/tasks/new')}
            className="bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 py-3 md:py-8 px-6 md:px-12 rounded-[1.5rem] md:rounded-[2rem] text-sm md:text-xl font-black transition-all hover:scale-[1.02] active:scale-[0.98] group flex items-center gap-2 md:gap-3"
          >
            <Plus size={18} className="md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-500" />
            <span className="hidden sm:inline">New Mission</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center animate-enter stagger-1 overflow-x-auto">
        <Card className="glass p-2 border-none inline-flex flex-wrap gap-2 rounded-3xl">
          {['all', 'pending', 'in progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 md:px-8 py-2 md:py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-slate-900 text-white shadow-xl scale-105'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
              }`}
            >
              {status}
            </button>
          ))}
        </Card>
        
        <div className="h-6 w-px bg-slate-200 hidden md:block" />
        
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
           Showing <span className="text-slate-900">{filteredTasks.length}</span>
        </p>
      </div>

      {filteredTasks.length === 0 ? (
        <Card className="glass p-8 md:p-20 lg:p-32 text-center border-none rounded-[2rem] md:rounded-[3rem] animate-enter stagger-2">
          <div className="max-w-md mx-auto space-y-6 md:space-y-8">
            <div className="w-20 md:w-28 h-20 md:h-28 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 animate-float border border-slate-100">
              <Calendar size={40} className="md:w-14 md:h-14" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Workspace Clear</h3>
              <p className="text-slate-500 text-sm md:text-lg font-medium leading-relaxed">No tasks matching this protocol. Deploy a new mission to begin tracking.</p>
            </div>
            <Button onClick={() => setLocation('/tasks/new')} variant="outline" className="py-3 md:py-7 px-8 md:px-12 rounded-2xl font-black text-sm md:text-base uppercase tracking-widest border-2 hover:bg-slate-50">
              Initialize Mission
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-8">
          {filteredTasks.map((task, idx) => {
            const p = getPriorityInfo(task.priorityScore);
            return (
              <Card
                key={task.id}
                className={`glass p-10 border-none group relative overflow-hidden transition-all duration-700 hover-lift animate-enter stagger-${(idx % 4) + 1} ${
                  task.status === 'Completed' ? 'opacity-60 saturate-50' : ''
                }`}
              >
                {/* Priority Visual Sidebar */}
                <div className={`absolute top-0 left-0 w-2.5 h-full bg-${p.color}-500 transition-all duration-500 group-hover:w-3`} />
                
                {task.priorityScore >= 95 && task.status !== 'Completed' && (
                  <div className="absolute top-0 right-0 px-8 py-3 bg-rose-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-bl-[2rem] shadow-2xl z-10 animate-pulse">
                    Critical Priority
                  </div>
                )}
                
                <div className="flex flex-col lg:flex-row items-start gap-10 relative z-10">
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className="mt-1 transition-all hover:scale-110 active:scale-90 group/check shrink-0"
                  >
                    {task.status === 'Completed' ? (
                      <div className="w-10 md:w-14 h-10 md:h-14 rounded-3xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                        <CheckCircle size={24} className="md:w-8 md:h-8" />
                      </div>
                    ) : (
                      <div className="w-10 md:w-14 h-10 md:h-14 rounded-3xl border-4 border-slate-100 bg-white hover:border-blue-500 transition-all shadow-sm group-hover/check:shadow-md flex items-center justify-center">
                        <Circle size={24} className="md:w-8 md:h-8 text-slate-100 group-hover/check:text-blue-100 transition-colors" />
                      </div>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 mb-3 md:mb-4">
                      <h3
                        className={`text-lg md:text-2xl lg:text-3xl font-black tracking-tight truncate leading-tight ${
                          task.status === 'Completed'
                            ? 'line-through text-slate-400'
                            : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <div className={`flex items-center gap-2.5 px-3 md:px-4 py-1.5 md:py-2 rounded-2xl bg-${p.color}-50 text-${p.color}-600 border border-${p.color}-100/50 shadow-sm whitespace-nowrap`}>
                        <p.icon size={12} className="md:w-4 md:h-4" />
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                          {p.label} • {task.priorityScore.toFixed(0)}
                        </span>
                      </div>
                    </div>
                    
                    <p className={`text-slate-500 text-sm md:text-lg lg:text-xl font-medium line-clamp-2 mb-4 md:mb-8 leading-relaxed max-w-4xl ${task.status === 'Completed' ? 'line-through opacity-60' : ''}`}>
                      {task.description || 'No strategic overview provided for this mission objective.'}
                    </p>

                    <div className="flex items-center gap-3 md:gap-8 flex-wrap">
                      <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-2.5 bg-slate-50 text-slate-600 rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100/50 whitespace-nowrap">
                        <Tag size={12} className="md:w-4 md:h-4" />
                        <span className="truncate">{task.category}</span>
                      </div>
                      
                      <div className={`flex items-center gap-2 md:gap-3 text-xs md:text-sm font-black uppercase tracking-widest ${task.isOverdue && task.status !== 'Completed' ? 'text-rose-600' : 'text-slate-400'}`}>
                        <Calendar size={14} className="md:w-5 md:h-5" />
                        <span className="truncate">{task.deadline ? new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Open'}</span>
                        {task.isOverdue && task.status !== 'Completed' && (
                          <span className="bg-rose-600 text-white px-2 md:px-4 py-1 md:py-1.5 rounded-full text-[7px] md:text-[9px] font-black shadow-lg shadow-rose-600/20 whitespace-nowrap">Overdue</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2 md:gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 transform lg:translate-x-6 lg:group-hover:translate-x-0 shrink-0">
                    <button
                      onClick={() => setLocation(`/tasks/${task.id}/edit`)}
                      className="p-3 md:p-5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl md:rounded-2xl transition-all shadow-sm hover:shadow-blue-500/20 active:scale-95"
                      title="Refine Objective"
                    >
                      <Edit2 size={18} className="md:w-7 md:h-7" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-3 md:p-5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl md:rounded-2xl transition-all shadow-sm hover:shadow-rose-500/20 active:scale-95"
                      title="Terminate Mission"
                    >
                      <Trash2 size={18} className="md:w-7 md:h-7" />
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
