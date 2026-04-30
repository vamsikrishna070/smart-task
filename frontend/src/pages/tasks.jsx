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
    const interval = setInterval(fetchTasks, 2000);
    return () => clearInterval(interval);
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
      const response = await fetch(`/api/tasks/${task._id}`, {
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

  const getPriorityColor = (priority) => {
    if (priority >= 95) return 'bg-red-100 text-red-800 border-red-300';
    if (priority >= 85) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (priority >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-600">Manage your to-do list</p>
        </div>
        <Button
          onClick={() => setLocation('/tasks/new')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create Task
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'in progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      {filteredTasks.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-600">No tasks found. Create one to get started!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks
            .sort((a, b) => b.priorityScore - a.priorityScore)
            .map((task) => (
              <Card
                key={task._id}
                className={`p-4 border-l-4 ${
                  task.status === 'Completed'
                    ? 'border-l-green-500 bg-slate-50'
                    : 'border-l-blue-500'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className="mt-1 text-slate-400 hover:text-blue-600 transition"
                  >
                    {task.status === 'Completed' ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`text-lg font-semibold ${
                          task.status === 'Completed'
                            ? 'line-through text-slate-500'
                            : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded border ${getPriorityColor(
                          task.priorityScore
                        )}`}
                      >
                        {task.priorityScore.toFixed(0)}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">{task.description}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                        {task.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setLocation(`/tasks/${task._id}/edit`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
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
