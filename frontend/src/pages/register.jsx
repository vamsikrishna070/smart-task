import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice.js';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Card } from '../components/ui/card.jsx';
import { Zap, ShieldCheck, Rocket, LayoutDashboard, AlertTriangle, Eye, EyeOff, UserPlus, CheckCircle2 } from 'lucide-react';
import { getApiUrl } from '../lib/api.js';

export default function Register() {
  const [, setLocation] = useLocation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Strategy Error: Passwords do not match');
    }

    setLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'System Error: Registration failed');
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
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setLocation('/login')}>
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-all">
              <LayoutDashboard className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">TaskFlow</h2>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Elevate your <br/>
              <span className="text-blue-600">daily performance.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
              Join the intelligent productivity ecosystem designed for high-performing teams and individuals.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            {[
              { text: 'Proprietary priority scoring engine', color: 'blue' },
              { text: 'Real-time multi-device synchronization', color: 'indigo' },
              { text: 'Advanced performance analytics dashboard', color: 'purple' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
                <span className="font-semibold text-slate-600 text-lg group-hover:text-slate-900 transition-colors">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-10">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Online: v2.4.0</span>
             </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full max-w-[480px] mx-auto">
          <Card className="bg-white border border-slate-200/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden">
            <div className="p-12 sm:p-16">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create Account</h2>
                <p className="text-slate-500 font-medium">Start your journey to peak productivity.</p>
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
                    Full Name
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Alex Rivera"
                    className="py-6 px-6 rounded-2xl border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-base font-medium placeholder:text-slate-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
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
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
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

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      className="py-6 px-6 rounded-2xl border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-base font-medium placeholder:text-slate-300 pr-14"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-7 rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20 transition-all hover:translate-y-[-2px] active:translate-y-[0px] mt-4 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : (
                    <>
                      <UserPlus size={20} />
                      Sign Up
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-10 text-center border-t border-slate-100 pt-8">
                <p className="text-slate-500 font-medium">
                  Already have an account?{' '}
                  <button 
                    onClick={() => setLocation('/login')}
                    className="text-blue-600 hover:text-blue-700 font-bold ml-1 transition-colors hover:underline"
                  >
                    Sign In
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
