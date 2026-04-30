import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, updateTask } from '../store/tasksSlice.js';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Card } from '../components/ui/card.jsx';
import { ChevronLeft, Target, Calendar, Tag, Activity, FileText } from 'lucide-react';

export default function TaskForm() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const tasks = useSelector((state) => state.tasks.tasks);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Work',
    status: 'Pending',
    deadline: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        setForm({
          title: task.title,
          description: task.description,
          category: task.category,
          status: task.status,
          deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
        });
      }
    }
  }, [id, tasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('A title is required to define your mission.');
      return;
    }

    if (!form.deadline) {
      setError('Every mission needs a deadline.');
      return;
    }

    setLoading(true);

    try {
      const deadline = new Date(form.deadline).toISOString();

      if (id && id !== 'new') {
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...form, deadline }),
        });

        if (!response.ok) throw new Error('Failed to update task');
        const updatedTask = await response.json();
        dispatch(updateTask(updatedTask));
      } else {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...form, deadline }),
        });

        if (!response.ok) throw new Error('Failed to create task');
        const newTask = await response.json();
        dispatch(addTask(newTask));
      }

      setLocation('/tasks');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-1000 pb-20">
      <button 
        onClick={() => setLocation('/tasks')}
        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition-colors mb-10 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Workflow
      </button>

      <div className="mb-12">
        <h1 className="text-6xl font-black tracking-tighter mb-4">
          <span className="text-gradient">
            {id && id !== 'new' ? 'Refine Mission' : 'New Mission'}
          </span>
        </h1>
        <p className="text-slate-500 font-medium text-xl">
          {id && id !== 'new'
            ? 'Adjust your strategy for peak performance.'
            : 'Initiate a new objective and track its execution.'}
        </p>
      </div>

      <Card className="glass p-12 border-none shadow-2xl shadow-blue-500/5">
        <form onSubmit={handleSubmit} className="space-y-10">
          {error && (
            <div className="p-5 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in zoom-in">
              <Activity size={18} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              <Target size={14} />
              Objective Title
            </label>
            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Design the Next Generation Interface"
              className="py-8 px-6 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-xl font-bold placeholder:text-slate-300"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              <FileText size={14} />
              Mission Context
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide a strategic breakdown of this objective..."
              className="w-full px-6 py-5 border border-slate-100 bg-slate-50/50 focus:bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg font-medium min-h-[150px] placeholder:text-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                <Tag size={14} />
                Strategic Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-6 py-5 border border-slate-100 bg-slate-50/50 focus:bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-lg cursor-pointer"
              >
                <option value="Work">Professional Mission</option>
                <option value="Personal">Personal Growth</option>
                <option value="Shopping">Acquisitions</option>
                <option value="Health">Vitality & Health</option>
                <option value="Other">Special Projects</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                <Activity size={14} />
                Execution Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-6 py-5 border border-slate-100 bg-slate-50/50 focus:bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-lg cursor-pointer"
              >
                <option value="Pending">Planned</option>
                <option value="In Progress">Executing</option>
                <option value="Completed">Mission Success</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              <Calendar size={14} />
              Mission Deadline
            </label>
            <Input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="py-8 px-6 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-lg font-bold"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-6">
            <Button
              type="submit"
              className="flex-[2] bg-blue-600 hover:bg-blue-700 py-8 rounded-3xl text-xl font-black shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading
                ? 'Processing Mission...'
                : id && id !== 'new'
                  ? 'Confirm Mission Re-alignment'
                  : 'Initiate Strategic Mission'}
            </Button>
            <Button
              type="button"
              onClick={() => setLocation('/tasks')}
              className="flex-1 bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 py-8 rounded-3xl text-xl font-bold transition-all shadow-sm"
            >
              Abort
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
