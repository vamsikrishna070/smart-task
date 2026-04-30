import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, updateTask } from '../store/tasksSlice.js';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Card } from '../components/ui/card.jsx';

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
      setError('Title is required');
      return;
    }

    if (!form.deadline) {
      setError('Deadline is required');
      return;
    }

    setLoading(true);

    try {
      const deadline = new Date(form.deadline).toISOString();

      if (id && id !== 'new') {
        // Update task
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            deadline,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update task');
        }

        const updatedTask = await response.json();
        dispatch(updateTask(updatedTask));
      } else {
        // Create new task
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            deadline,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create task');
        }

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
    <div className="max-w-2xl mx-auto animate-in slide-up duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">
          <span className="text-gradient">
            {id && id !== 'new' ? 'Edit Task' : 'Create New Task'}
          </span>
        </h1>
        <p className="text-slate-500 font-medium mt-2">
          {id && id !== 'new'
            ? 'Refine your task details for better clarity.'
            : 'Define your next achievement and stay productive.'}
        </p>
      </div>

      <Card className="glass p-8 border-none">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
              Title
            </label>
            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className="py-6 px-4 rounded-xl border-slate-200 focus:ring-blue-500 text-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add more context to this task..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              rows="4"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white font-medium"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white font-medium"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
              Deadline
            </label>
            <Input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="py-6 px-4 rounded-xl border-slate-200 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-7 rounded-2xl text-lg font-bold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading
                ? id && id !== 'new'
                  ? 'Updating...'
                  : 'Creating...'
                : id && id !== 'new'
                  ? 'Update Task'
                  : 'Create Task'}
            </Button>
            <Button
              type="button"
              onClick={() => setLocation('/tasks')}
              className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 py-7 rounded-2xl text-lg font-bold transition-all"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
