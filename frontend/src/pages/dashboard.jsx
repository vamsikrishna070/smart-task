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
      <div className="flex items-center justify-center h-[60vh] md:h-[70vh]">
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full group-hover:bg-blue-500/30 transition-all duration-1000" />
          <div className="animate-spin rounded-full h-16 md:h-20 w-16 md:w-20 border-t-4 border-blue-600 relative z-10"></div>
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Zap className="text-blue-600 animate-pulse" size={24} className="md:w-8 md:h-8" />
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
    <div className="space-y-8 md:space-y-12 pb-12">
      {/* Dynamic Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 animate-enter">
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest">
              Live Overview
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Synchronized</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-black tracking-tight text-slate-900 leading-none">
            Welcome back, <br/>
            <span className="text-blue-600">{user?.name?.split(' ')[0] || 'Member'}.</span>
          </h1>
          <p className="text-xs md:text-base lg:text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
             You've completed <span className="text-slate-900 font-bold">{insights.completedToday}</span> missions today. 
             Keep the momentum going to hit your target.
          </p>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="p-1.5 bg-white rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-2 md:gap-4">
            <div className="pl-3 md:pl-6 pr-2 md:pr-4 py-2 md:py-3">
              <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Impact</p>
              <p className="text-xl md:text-2xl font-black text-slate-900">{insights.totalTasks}</p>
            </div>
            <div className="w-12 md:w-16 h-12 md:h-16 rounded-xl md:rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0">
              <Target size={20} className="md:w-7 md:h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* High-Impact Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Efficiency', value: `${insights.completionRate}%`, icon: Zap, color: 'blue', sub: 'Weekly average' },
          { label: 'Completed', value: insights.completedTasks, icon: CheckCircle2, color: 'emerald', sub: 'Lifetime count' },
          { label: 'Active', value: insights.inProgressTasks, icon: Clock, color: 'blue', sub: 'High focus' },
          { label: 'Overdue', value: insights.overdueTasks, icon: AlertCircle, color: 'rose', sub: 'Priority fix' },
        ].map((stat, idx) => (
          <Card key={idx} className={`glass hover-lift p-4 md:p-8 border-none group animate-enter stagger-${idx + 1}`}>
            <div className="flex justify-between items-start mb-4 md:mb-8">
              <div className={`p-2 md:p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl group-hover:rotate-12 transition-transform duration-500 shadow-sm`}>
                <stat.icon size={18} className="md:w-6 md:h-6" />
              </div>
              <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <TrendingUp size={14} className="md:w-4 md:h-4" />
              </div>
            </div>
            <div>
              <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 md:mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              </div>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 mt-1 md:mt-2">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="glass p-6 md:p-10 lg:col-span-2 border-none animate-enter stagger-3 overflow-hidden">
          <div className="flex items-center justify-between mb-6 md:mb-12 gap-4">
            <div className="min-w-0">
              <h2 className="text-lg md:text-2xl font-black text-slate-900 flex items-center gap-2 md:gap-3 tracking-tight">
                Execution Pulse
              </h2>
              <p className="text-xs md:text-sm text-slate-500 font-medium">Daily productivity throughput</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
               <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors">
                  <BarChart3 size={16} className="md:w-5 md:h-5" />
               </div>
            </div>
          </div>
          
          <div className="h-62.5 sm:h-75 md:h-95 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em'}} dy={12} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={Math.max(30, window.innerWidth < 768 ? 24 : 48)}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6 md:space-y-8 animate-enter stagger-4">
          <Card className="glass p-6 md:p-8 border-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full group-hover:bg-blue-500/10 transition-all duration-1000" />
            <h2 className="text-lg md:text-xl font-black text-slate-900 mb-4 md:mb-8 tracking-tight">Focus Mastery</h2>
            <div className="relative flex items-center justify-center h-40 md:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
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
              <div className="absolute inset-0 flex flex-col items-center justify-center shrink-0">
                <span className="text-2xl md:text-4xl font-black text-slate-900">{insights.completionRate}%</span>
                <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Efficiency</span>
              </div>
            </div>
          </Card>

          <Card className="glass p-6 md:p-8 border-none bg-slate-900 text-white relative overflow-hidden group">
            <div className="absolute -bottom-8 -right-8 p-4 opacity-5 group-hover:scale-110 transition-transform duration-1000">
              <TrendingUp size={160} />
            </div>
            <h2 className="text-lg md:text-xl font-black mb-4 md:mb-8 tracking-tight">Strategic Insight</h2>
            <div className="space-y-3 md:space-y-6 relative z-10">
              <div className="flex items-center gap-3 md:gap-5 p-3 md:p-5 bg-white/5 rounded-2xl md:rounded-3xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-all cursor-default">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-blue-500/20 text-blue-400 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10 shrink-0">
                  <Zap size={18} className="md:w-6 md:h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[7px] md:text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-1">Peak Category</p>
                  <p className="font-bold text-base md:text-lg leading-tight truncate">{insights.mostActiveCategory || 'All Systems Nominal'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-5 p-3 md:p-5 bg-white/5 rounded-2xl md:rounded-3xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-all cursor-default">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-emerald-500/20 text-emerald-400 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/10 shrink-0">
                  <TrendingUp size={18} className="md:w-6 md:h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[7px] md:text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-1">Daily Streak</p>
                  <p className="font-bold text-base md:text-lg leading-tight">{insights.dailyActivityCount} Ops</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
