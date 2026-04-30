import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setInsights } from '../store/insightsSlice.js';
import { Card } from '../components/ui/card.jsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const insights = useSelector((state) => state.insights);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch('/api/insights', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          dispatch(setInsights(data));
        }
      } catch (error) {
        console.error('Failed to fetch insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
    const interval = setInterval(fetchInsights, 5000);
    return () => clearInterval(interval);
  }, [token, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const chartData = [
    {
      name: 'Tasks',
      completed: insights.completedTasks,
      pending: insights.pendingTasks,
      inProgress: insights.inProgressTasks,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome to your productivity hub</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Tasks</p>
              <p className="text-3xl font-bold text-slate-900">{insights.totalTasks}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-full">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Completed Today</p>
              <p className="text-3xl font-bold text-slate-900">{insights.completedToday}</p>
            </div>
            <div className="p-3 bg-green-200 rounded-full">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-slate-900">{insights.inProgressTasks}</p>
            </div>
            <div className="p-3 bg-yellow-200 rounded-full">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Overdue</p>
              <p className="text-3xl font-bold text-slate-900">{insights.overdueTasks}</p>
            </div>
            <div className="p-3 bg-red-200 rounded-full">
              <AlertCircle className="text-red-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Task Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#10b981" />
              <Bar dataKey="pending" fill="#6b7280" />
              <Bar dataKey="inProgress" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Activity</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-slate-600">Daily Activity</span>
              <span className="font-bold text-slate-900">{insights.dailyActivityCount}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-slate-600">Completion Rate</span>
              <span className="font-bold text-slate-900">{insights.completionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Most Active</span>
              <span className="font-bold text-slate-900">{insights.mostActiveCategory}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
