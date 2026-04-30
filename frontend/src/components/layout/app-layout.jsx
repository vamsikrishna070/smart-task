import React, { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice.js';
import { Button } from '../ui/button.jsx';
import Sidebar from './sidebar.jsx';

export default function AppLayout({ children }) {
  const [, setLocation] = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  const handleLogout = () => {
    dispatch(logout());
    setLocation('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-transparent">
        <header className="glass sticky top-0 z-30 px-8 py-5 flex items-center justify-between border-x-0 border-t-0">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-gradient">TaskFlow</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900">{user?.name || 'User'}</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{user?.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto p-8 lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
