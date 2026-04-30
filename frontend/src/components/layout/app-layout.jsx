import React, { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice.js';
import { Button } from '../ui/button.jsx';
import Sidebar from './sidebar.jsx';
import { Search, Bell, LogOut, User as UserIcon } from 'lucide-react';

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
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 px-10 flex items-center justify-between border-b border-slate-200/60 bg-white/50 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search missions, categories, or insights..."
                className="w-full pl-12 pr-6 py-3.5 bg-slate-100/50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-600 outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6 ml-10">
            <div className="flex items-center gap-2">
              <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
            </div>
            
            <div className="h-10 w-[1px] bg-slate-200 mx-2" />

            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-900 leading-tight">{user?.name || 'User'}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Premium Member</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border border-white shadow-sm overflow-hidden group cursor-pointer hover:border-blue-200 transition-all">
                <UserIcon className="text-slate-400 group-hover:text-blue-500 transition-colors" size={24} />
              </div>
              <button 
                onClick={handleLogout}
                className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group"
                title="Sign Out"
              >
                <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-transparent">
          <div className="max-w-7xl mx-auto p-10 lg:p-14">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
