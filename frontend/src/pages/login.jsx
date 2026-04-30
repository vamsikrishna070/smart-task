import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice.js';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Card } from '../components/ui/card.jsx';
import { Zap, ShieldCheck, Rocket, LayoutDashboard, AlertTriangle, Eye, EyeOff, LogIn } from 'lucide-react';
import { getApiUrl } from '../lib/api.js';

export default function Login() {
  const [, setLocation] = useLocation();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Access Denied: Invalid credentials');
      }

      const { user, token } = await response.json();
      dispatch(setCredentials({ user, token }));
      setLocation('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[#fafafa] relative overflow-hidden font-sans selection:bg-blue-100">
      {/* Sophisticated Background Element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.4] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #e5e7eb 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Side: Brand & Value Prop */}
        <div className="hidden lg:block space-y-10 pr-12 border-r border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <LayoutDashboard className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">TaskFlow</h2>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Master your <br/>
              <span className="text-blue-600">productivity flow.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
              The intelligent task management system designed for teams who value execution over busywork.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 max-w-lg">
            {[
              { icon: Zap, text: 'Real-time Sync', color: 'blue' },
              { icon: ShieldCheck, text: 'Secure JWT Auth', color: 'indigo' },
              { icon: Rocket, text: 'Smart Priority', color: 'purple' },
              { icon: LayoutDashboard, text: 'Deep Insights', color: 'violet' },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col gap-3 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className={`w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl`}>
                  <feature.icon size={20} />
                </div>
                <span className="font-bold text-slate-700">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full max-w-[480px] mx-auto">
          <Card className="bg-white border border-slate-200/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden">
            <div className="p-12 sm:p-16">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Sign In</h2>
                <p className="text-slate-500 font-medium">Welcome back! Please enter your details.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 animate-in fade-in zoom-in">
                    <AlertTriangle size={16} />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="py-6 px-6 rounded-2xl border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-base font-medium placeholder:text-slate-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="py-6 px-6 rounded-2xl border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-base font-medium placeholder:text-slate-300 pr-14"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                   <label className="flex items-center gap-2 text-slate-500 font-semibold text-sm cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" />
                      <span className="group-hover:text-slate-700 transition-colors">Remember me</span>
                   </label>
                   <button type="button" className="text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors">
                      Forgot?
                   </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-7 rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20 transition-all hover:translate-y-[-2px] active:translate-y-[0px] mt-4 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : (
                    <>
                      <LogIn size={20} />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-10 text-center border-t border-slate-100 pt-8">
                <p className="text-slate-500 font-medium">
                  New to TaskFlow?{' '}
                  <button 
                    onClick={() => setLocation('/register')}
                    className="text-blue-600 hover:text-blue-700 font-bold ml-1 transition-colors hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
