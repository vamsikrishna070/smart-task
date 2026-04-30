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
    // No polling interval needed thanks to Socket.io
  }, [token, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const chartData = [
    {
      name: 'Status',
      completed: insights.completedTasks,
      pending: insights.pendingTasks,
      inProgress: insights.inProgressTasks,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">
            <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            {insights.completedToday > 0 
              ? `🔥 Great job! You completed ${insights.completedToday} task${insights.completedToday > 1 ? 's' : ''} today.` 
              : "Ready to conquer your day? Let's get started!"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass card-hover p-6 border-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-bold uppercase tracking-wider">Total Tasks</p>
              <p className="text-4xl font-black text-slate-900 mt-1">{insights.totalTasks}</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-2xl">
              <TrendingUp className="text-blue-600" size={28} />
            </div>
          </div>
        </Card>

        <Card className="glass card-hover p-6 border-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-bold uppercase tracking-wider">Completed Today</p>
              <p className="text-4xl font-black text-slate-900 mt-1">{insights.completedToday}</p>
            </div>
            <div className="p-4 bg-green-100 rounded-2xl">
              <CheckCircle2 className="text-green-600" size={28} />
            </div>
          </div>
        </Card>

        <Card className="glass card-hover p-6 border-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-500 text-sm font-bold uppercase tracking-wider">In Progress</p>
              <p className="text-4xl font-black text-slate-900 mt-1">{insights.inProgressTasks}</p>
            </div>
            <div className="p-4 bg-amber-100 rounded-2xl">
              <Clock className="text-amber-500" size={28} />
            </div>
          </div>
        </Card>

        <Card className="glass card-hover p-6 border-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-600 text-sm font-bold uppercase tracking-wider">Overdue</p>
              <p className="text-4xl font-black text-slate-900 mt-1">{insights.overdueTasks}</p>
            </div>
            <div className="p-4 bg-rose-100 rounded-2xl">
              <AlertCircle className="text-rose-600" size={28} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="glass p-8 lg:col-span-2 border-none">
          <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            Performance Analytics
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar dataKey="pending" fill="#94a3b8" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar dataKey="inProgress" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass p-8 border-none">
          <h2 className="text-xl font-bold text-slate-900 mb-8">Quick Insights</h2>
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-50 flex justify-between items-center group transition-all hover:bg-white hover:shadow-md">
              <span className="text-slate-500 font-medium">Daily Activity</span>
              <span className="font-bold text-2xl text-slate-900 group-hover:text-blue-600 transition-colors">
                {insights.dailyActivityCount}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 flex flex-col gap-2 group transition-all hover:bg-white hover:shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Completion Rate</span>
                <span className="font-bold text-2xl text-slate-900 group-hover:text-green-600 transition-colors">
                  {insights.completionRate}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full transition-all duration-1000" 
                  style={{ width: `${insights.completionRate}%` }}
                />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 flex justify-between items-center group transition-all hover:bg-white hover:shadow-md">
              <span className="text-slate-500 font-medium">Top Category</span>
              <span className="font-bold text-lg text-slate-900 group-hover:text-purple-600 transition-colors px-3 py-1 bg-white rounded-lg shadow-sm">
                {insights.mostActiveCategory}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
