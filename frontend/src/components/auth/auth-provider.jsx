import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { setCredentials } from '../../store/authSlice.js';

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const user = await response.json();
            dispatch(setCredentials({ user, token }));
          } else {
            localStorage.removeItem('taskflow_token');
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, [dispatch, token]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
