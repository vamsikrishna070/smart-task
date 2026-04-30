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
      const task = tasks.find((t) => t._id === id);
      if (task) {
        setForm({
          title: task.title,
          description: task.description,
          category: task.category,
          status: task.status,
          deadline: new Date(task.deadline).toISOString().split('T')[0],
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">
          {id && id !== 'new' ? 'Edit Task' : 'Create New Task'}
        </h1>
        <p className="text-slate-600 mt-2">
          {id && id !== 'new'
            ? 'Update your task details'
            : 'Add a new task to your to-do list'}
        </p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title *
            </label>
            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter task description"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Deadline *
            </label>
            <Input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
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
              onClick={() => navigate('/tasks')}
              className="flex-1 bg-slate-200 text-slate-900 hover:bg-slate-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
