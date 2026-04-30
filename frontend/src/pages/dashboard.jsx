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
import { getApiUrl } from '../lib/api.js';

export default function Dashboard() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const insights = useSelector((state) => state.insights);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch(getApiUrl('/api/insights'), {
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
      <div className="flex items-center justify-center h-[70vh]">
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full group-hover:bg-blue-500/30 transition-all duration-1000" />
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 relative z-10"></div>
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Zap className="text-blue-600 animate-pulse" size={32} />
          </div>
        </div>
      </div>
    );
  }

  const statusData = [
    { name: 'Pending', value: insights.pendingTasks, color: '#94a3b8' },
    { name: 'In Progress', value: insights.inProgressTasks, color: '#3b82f6' },
    { name: 'Completed', value: insights.completedTasks, color: '#10b981' },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Dynamic Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 animate-enter">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
              Live Overview
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Synchronized</span>
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tight text-slate-900 leading-none">
            Welcome back, <br/>
            <span className="text-blue-600">{user?.name?.split(' ')[0] || 'Member'}.</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl">
             You've completed <span className="text-slate-900 font-bold">{insights.completedToday} missions</span> today. 
             Keep the momentum going to hit your target.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="p-1.5 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-2">
            <div className="pl-6 pr-4 py-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Impact</p>
              <p className="text-2xl font-black text-slate-900">{insights.totalTasks}</p>
            </div>
            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-white">
              <Target size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* High-Impact Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Efficiency', value: `${insights.completionRate}%`, icon: Zap, color: 'blue', sub: 'Weekly average' },
          { label: 'Completed', value: insights.completedTasks, icon: CheckCircle2, color: 'emerald', sub: 'Lifetime count' },
          { label: 'Active', value: insights.inProgressTasks, icon: Clock, color: 'blue', sub: 'High focus' },
          { label: 'Overdue', value: insights.overdueTasks, icon: AlertCircle, color: 'rose', sub: 'Priority fix' },
        ].map((stat, idx) => (
          <Card key={idx} className={`glass hover-lift p-8 border-none group animate-enter stagger-${idx + 1}`}>
            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-[1.25rem] group-hover:rotate-12 transition-transform duration-500 shadow-sm`}>
                <stat.icon size={24} />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <TrendingUp size={16} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              </div>
              <p className="text-xs font-bold text-slate-400 mt-2">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="glass p-10 lg:col-span-2 border-none animate-enter stagger-3">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                Execution Pulse
              </h2>
              <p className="text-slate-500 font-medium">Daily productivity throughput</p>
            </div>
            <div className="flex gap-2">
               <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors">
                  <BarChart3 size={20} />
               </div>
            </div>
          </div>
          
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={48}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-8 animate-enter stagger-4">
          <Card className="glass p-8 border-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full group-hover:bg-blue-500/10 transition-all duration-1000" />
            <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Focus Mastery</h2>
            <div className="relative flex items-center justify-center h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={12}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900">{insights.completionRate}%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Efficiency</span>
              </div>
            </div>
          </Card>

          <Card className="glass p-8 border-none bg-slate-900 text-white relative overflow-hidden group">
            <div className="absolute -bottom-8 -right-8 p-4 opacity-5 group-hover:scale-110 transition-transform duration-1000">
              <TrendingUp size={160} />
            </div>
            <h2 className="text-xl font-black mb-8 tracking-tight">Strategic Insight</h2>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-5 p-5 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-all cursor-default">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                  <Zap size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-1">Peak Category</p>
                  <p className="font-bold text-lg leading-tight">{insights.mostActiveCategory || 'All Systems Nominal'}</p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-5 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-all cursor-default">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-1">Daily Streak</p>
                  <p className="font-bold text-lg leading-tight">{insights.dailyActivityCount} Operations</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
