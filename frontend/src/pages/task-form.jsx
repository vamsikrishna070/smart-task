import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, updateTask } from '../store/tasksSlice.js';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Card } from '../components/ui/card.jsx';
import { ChevronLeft, Target, Calendar, Tag, Activity, FileText } from 'lucide-react';
import { getApiUrl } from '../lib/api.js';

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
        const response = await fetch(getApiUrl(`/api/tasks/${id}`), {
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
        const response = await fetch(getApiUrl('/api/tasks'), {
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
    <div className="max-w-4xl mx-auto pb-20">
      <div className="animate-enter">
        <button 
          onClick={() => setLocation('/tasks')}
          className="flex items-center gap-3 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-all mb-12 group"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:-translate-x-1 transition-all">
            <ChevronLeft size={18} />
          </div>
          Back to Workflow
        </button>

        <div className="mb-16">
          <div className="px-3 py-1 bg-blue-100 text-blue-700 inline-block rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            Deployment Module
          </div>
          <h1 className="text-6xl font-black tracking-tight text-slate-900 leading-none mb-4">
            {id && id !== 'new' ? 'Refine Objective.' : 'Deploy Mission.'}
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl">
            {id && id !== 'new'
              ? 'Calibrate your strategic parameters for peak execution.'
              : 'Initialize a new operational target within your workspace.'}
          </p>
        </div>
      </div>

      <Card className="glass p-12 border-none shadow-2xl shadow-blue-500/5 animate-enter stagger-1 rounded-[3rem]">
        <form onSubmit={handleSubmit} className="space-y-12">
          {error && (
            <div className="p-6 bg-rose-50 border border-rose-100 text-rose-700 rounded-3xl text-sm font-black uppercase tracking-widest flex items-center gap-4 animate-enter shadow-sm">
              <Activity size={20} />
              {error}
            </div>
          )}

          <div className="space-y-5">
            <label className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">
              <Target size={16} className="text-blue-500" />
              Mission Title
            </label>
            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Design the Next Generation Interface"
              className="py-10 px-8 rounded-[2rem] border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-2xl font-black placeholder:text-slate-300 shadow-sm"
              required
            />
          </div>

          <div className="space-y-5">
            <label className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">
              <FileText size={16} className="text-blue-500" />
              Objective Context
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide a strategic breakdown of this objective..."
              className="w-full px-8 py-7 border border-slate-100 bg-slate-50/50 focus:bg-white rounded-[2rem] focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-xl font-medium min-h-[180px] placeholder:text-slate-300 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-5">
              <label className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">
                <Tag size={16} className="text-blue-500" />
                Strategic Sector
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-8 py-6 border border-slate-100 bg-slate-50/50 focus:bg-white rounded-[2rem] focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-black text-lg cursor-pointer shadow-sm appearance-none"
              >
                <option value="Work">Professional Mission</option>
                <option value="Personal">Personal Growth</option>
                <option value="Shopping">Strategic Acquisition</option>
                <option value="Health">Vitality & Wellness</option>
                <option value="Other">Classified Project</option>
              </select>
            </div>

            <div className="space-y-5">
              <label className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">
                <Activity size={16} className="text-blue-500" />
                Current Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-8 py-6 border border-slate-100 bg-slate-50/50 focus:bg-white rounded-[2rem] focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-black text-lg cursor-pointer shadow-sm appearance-none"
              >
                <option value="Pending">Planned</option>
                <option value="In Progress">Executing</option>
                <option value="Completed">Objective Success</option>
              </select>
            </div>
          </div>

          <div className="space-y-5">
            <label className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">
              <Calendar size={16} className="text-blue-500" />
              Target Deadline
            </label>
            <Input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="py-10 px-8 rounded-[2rem] border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-xl font-black shadow-sm"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-8 pt-10">
            <Button
              type="submit"
              className="flex-[2] bg-blue-600 hover:bg-blue-700 py-9 rounded-[2rem] text-xl font-black shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              disabled={loading}
            >
              {loading
                ? 'Synching with Satellite...'
                : id && id !== 'new'
                  ? 'Confirm Re-alignment'
                  : 'Launch Strategic Mission'}
            </Button>
            <Button
              type="button"
              onClick={() => setLocation('/tasks')}
              className="flex-1 bg-white text-slate-400 hover:bg-slate-50 border border-slate-100 py-9 rounded-[2rem] text-xl font-black transition-all hover:text-slate-600"
            >
              Abort
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
