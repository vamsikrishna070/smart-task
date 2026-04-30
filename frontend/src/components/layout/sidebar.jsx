import React from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, ListTodo, Plus, TrendingUp } from 'lucide-react';

export default function Sidebar() {
  const [pathname] = useLocation();

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  return (
    <aside className="w-80 glass-dark text-slate-300 flex flex-col border-r border-white/5 relative z-40">
      <div className="p-10 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/40 relative z-10">
              <LayoutDashboard className="text-white" size={24} />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-900 z-20 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter leading-none">TaskFlow</h2>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Command Center</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-3">
        <div className="px-4 mb-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
          Strategy
        </div>
        
        <Link 
          href="/dashboard"
          className={`flex items-center gap-4 px-6 py-4.5 rounded-[1.25rem] transition-all duration-500 group relative overflow-hidden ${
            isActive('/dashboard')
              ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20'
              : 'hover:bg-white/5 hover:text-white'
          }`}
        >
          <LayoutDashboard size={20} className={isActive('/dashboard') ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'} />
          <span className="font-black text-sm uppercase tracking-widest">Analytics Pulse</span>
          {isActive('/dashboard') && (
            <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full" />
          )}
        </Link>

        <Link 
          href="/tasks"
          className={`flex items-center gap-4 px-6 py-4.5 rounded-[1.25rem] transition-all duration-500 group relative overflow-hidden ${
            isActive('/tasks')
              ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20'
              : 'hover:bg-white/5 hover:text-white'
          }`}
        >
          <ListTodo size={20} className={isActive('/tasks') ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'} />
          <span className="font-black text-sm uppercase tracking-widest">Active Missions</span>
          {isActive('/tasks') && (
            <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full" />
          )}
        </Link>

        <div className="px-4 mt-12 mb-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
          Deployment
        </div>

        <Link 
          href="/tasks/new"
          className="flex items-center gap-4 px-6 py-4.5 rounded-[1.25rem] hover:bg-white/5 hover:text-white transition-all duration-500 group border border-white/5 hover:border-white/10"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
            <Plus size={20} className="text-blue-400 group-hover:rotate-90 transition-transform duration-500" />
          </div>
          <span className="font-black text-sm uppercase tracking-widest">New Operation</span>
        </Link>
      </nav>

      <div className="p-8 mt-auto">
        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-800 text-white relative overflow-hidden group shadow-2xl shadow-blue-900/20">
          <div className="absolute -top-6 -right-6 p-4 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000">
            <TrendingUp size={100} />
          </div>
          <p className="text-[10px] font-black opacity-60 mb-2 uppercase tracking-[0.2em]">Tier Status</p>
          <p className="font-black text-xl mb-6 leading-tight">Unlimited <br/>Strategic Operations</p>
          <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md transition-all border border-white/10">
            Maximize Reach
          </button>
        </div>
      </div>
    </aside>
  );
}
