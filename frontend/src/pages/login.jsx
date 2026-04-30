import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice.js';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Card } from '../components/ui/card.jsx';

export default function Login() {
  const [, setLocation] = useLocation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_50%)]" />
      
      <Card className="glass w-full max-w-md border-none overflow-hidden relative z-10 animate-in zoom-in duration-500">
        <div className="p-10">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black tracking-tight mb-2">
              <span className="text-gradient">TaskFlow</span>
            </h1>
            <p className="text-slate-500 font-medium">Elevate your productivity today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="py-6 px-4 rounded-xl border-slate-200 focus:ring-blue-500/20"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="py-6 px-4 rounded-xl border-slate-200 focus:ring-blue-500/20"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-7 rounded-2xl text-lg font-bold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            New to TaskFlow?{' '}
            <button 
              onClick={() => setLocation('/register')}
              className="text-blue-600 hover:text-blue-700 font-bold ml-1 transition-colors"
            >
              Create an account
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
