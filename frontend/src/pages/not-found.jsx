import React from 'react';
import { useLocation } from 'wouter';
import { Card } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertTriangle size={40} className="text-red-600" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
          <p className="text-lg font-semibold text-slate-700 mb-2">Page Not Found</p>
          <p className="text-slate-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => setLocation('/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => setLocation('/tasks')}
              className="w-full bg-slate-200 text-slate-900 hover:bg-slate-300"
            >
              View Tasks
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
