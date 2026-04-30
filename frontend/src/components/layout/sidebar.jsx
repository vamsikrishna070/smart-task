import React from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, ListTodo, Plus } from 'lucide-react';

export default function Sidebar() {
  const [pathname] = useLocation();

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold">TaskFlow</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link href="/dashboard">
          <a
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive('/dashboard')
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
        </Link>

        <Link href="/tasks">
          <a
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive('/tasks')
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ListTodo size={20} />
            <span>Tasks</span>
          </a>
        </Link>

        <Link href="/tasks/new">
          <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
            <Plus size={20} />
            <span>New Task</span>
          </a>
        </Link>
      </nav>
    </div>
  );
}
