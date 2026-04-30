import React from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, ListTodo, Plus, TrendingUp } from 'lucide-react';

export default function Sidebar() {
  const [pathname] = useLocation();

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  return (
    <aside className="w-72 glass-dark text-slate-300 flex flex-col border-r border-white/5 relative z-40">
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <LayoutDashboard className="text-white" size={22} />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">TaskFlow</h2>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <div className="px-4 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Main Menu
        </div>
        
        <Link href="/dashboard">
          <a
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
              isActive('/dashboard')
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard size={22} className={isActive('/dashboard') ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} />
            <span className="font-bold">Dashboard</span>
          </a>
        </Link>

        <Link href="/tasks">
          <a
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
              isActive('/tasks')
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <ListTodo size={22} className={isActive('/tasks') ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} />
            <span className="font-bold">Tasks</span>
          </a>
        </Link>

        <div className="px-4 mt-10 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Actions
        </div>

        <Link href="/tasks/new">
          <a className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/5 hover:text-white transition-all duration-300 group">
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20">
              <Plus size={18} className="text-blue-400" />
            </div>
            <span className="font-bold">Create New</span>
          </a>
        </Link>
      </nav>

      <div className="p-6 mt-auto">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
            <TrendingUp size={60} />
          </div>
          <p className="text-xs font-bold opacity-80 mb-1">PRO PLAN</p>
          <p className="font-black text-lg mb-4">Unlimited Tasks</p>
          <button className="w-full py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-sm transition-all">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
