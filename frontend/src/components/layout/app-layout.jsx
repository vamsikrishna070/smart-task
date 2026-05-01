import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice.js';
import { Button } from '../ui/button.jsx';
import Sidebar from './sidebar.jsx';
import { Search, Bell, LogOut, User as UserIcon, Menu, X } from 'lucide-react';

export default function AppLayout({ children }) {
  const [, setLocation] = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  useEffect(() => {
    // Close sidebar when navigating
    setSidebarOpen(false);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setLocation('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - hidden on mobile, shown on tablet and up */}
      <div className={`fixed md:static inset-y-0 left-0 w-80 transform md:transform-none transition-transform duration-300 z-30 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 md:h-24 px-4 md:px-10 flex items-center justify-between border-b border-slate-200/60 bg-white/50 backdrop-blur-xl sticky top-0 z-30">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex items-center flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search missions, categories, or insights..."
                className="w-full pl-12 pr-6 py-3.5 bg-slate-100/50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-600 outline-none"
              />
            </div>
          </div>

          {/* Mobile search button */}
          <div className="md:hidden flex-1 flex items-center justify-center">
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <Search size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6 md:ml-10">
            <div className="flex items-center gap-2">
              <button className="p-2 md:p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
                <Bell size={18} className="md:w-5 md:h-5" />
                <span className="absolute top-2 md:top-3 right-2 md:right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
            </div>
            
            <div className="hidden md:block h-10 w-px bg-slate-200 mx-2" />

            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
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

            {/* Mobile user menu */}
            <div className="flex md:hidden items-center gap-2">
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-transparent">
          <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 md:py-10 lg:px-14 lg:py-14">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
