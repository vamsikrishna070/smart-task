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
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Zap, Target, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
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
  }, [token, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="text-blue-600" size={24} />
          </div>
        </div>
      </div>
    );
  }

  const statusData = [
    { name: 'Pending', value: insights.pendingTasks, color: '#94a3b8' },
    { name: 'In Progress', value: insights.inProgressTasks, color: '#f59e0b' },
    { name: 'Completed', value: insights.completedTasks, color: '#10b981' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-6xl font-black tracking-tighter mb-4">
            <span className="text-gradient">Welcome, {user?.name?.split(' ')[0] || 'User'}!</span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
              ))}
            </div>
            <p className="text-slate-500 font-medium text-lg">
              {insights.completedToday > 0 
                ? `🚀 You've crushed ${insights.completedToday} task${insights.completedToday > 1 ? 's' : ''} today!` 
                : "Your productivity journey starts here."}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-3xl border border-white shadow-sm">
          <div className="px-6 py-3 rounded-2xl bg-white shadow-sm flex items-center gap-2">
            <Target className="text-blue-600" size={18} />
            <span className="font-bold text-slate-700">Daily Goal: 5 Tasks</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Tasks', value: insights.totalTasks - insights.completedTasks, icon: Zap, color: 'blue', sub: 'Updated live' },
          { label: 'Done Today', value: insights.completedToday, icon: CheckCircle2, color: 'green', sub: 'Keep it up!' },
          { label: 'Work in Progress', value: insights.inProgressTasks, icon: Clock, color: 'amber', sub: 'Stay focused' },
          { label: 'Overdue', value: insights.overdueTasks, icon: AlertCircle, color: 'rose', sub: 'Action needed' },
        ].map((stat, idx) => (
          <Card key={idx} className="glass card-hover p-8 border-none group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 bg-${stat.color}-100 text-${stat.color}-600 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={28} />
              </div>
              <TrendingUp className="text-slate-300" size={20} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black text-slate-900">{stat.value}</p>
                <span className="text-xs font-bold text-slate-400">{stat.sub}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="glass p-10 lg:col-span-2 border-none">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <BarChart3 size={24} className="text-blue-600" />
                Performance Pulse
              </h2>
              <p className="text-slate-500 font-medium">Tracking your execution efficiency</p>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="glass p-8 border-none">
            <h2 className="text-xl font-black text-slate-900 mb-6">Execution Mastery</h2>
            <div className="relative flex items-center justify-center h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">{insights.completionRate}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Success Rate</span>
              </div>
            </div>
          </Card>

          <Card className="glass p-8 border-none bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
            <h2 className="text-xl font-bold mb-6">Daily Insight</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold opacity-70 uppercase tracking-wider">Top Category</p>
                  <p className="font-bold text-lg">{insights.mostActiveCategory}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <div className="p-3 bg-white/20 rounded-xl">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold opacity-70 uppercase tracking-wider">Activity Streak</p>
                  <p className="font-bold text-lg">{insights.dailyActivityCount} interactions</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
