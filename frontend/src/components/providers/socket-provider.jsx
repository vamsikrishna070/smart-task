import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { setTasks, addTask, updateTask, removeTask } from '../../store/tasksSlice.js';
import { setInsights } from '../../store/insightsSlice.js';
import { getApiUrl } from '../../lib/api.js';

let socket = null;

export default function SocketProvider({ children }) {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      return;
    }

    if (socket?.connected) return;

    // In production, we need the actual backend origin (e.g. https://backend.render.com)
    // In development, the proxy handles '/'
    const socketOrigin = import.meta.env.VITE_API_URL || '/';

    socket = io(socketOrigin, {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('task:created', (task) => {
      console.log('Task created via socket:', task);
      dispatch(addTask(task));
    });

    socket.on('task:updated', (task) => {
      console.log('Task updated via socket:', task);
      dispatch(updateTask(task));
    });

    socket.on('task:deleted', (data) => {
      console.log('Task deleted via socket:', data.id);
      dispatch(removeTask(data.id));
    });

    socket.on('insights:updated', async () => {
      console.log('Insights updated via socket, refetching...');
      try {
        const response = await fetch('/api/insights', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          dispatch(setInsights(data));
        }
      } catch (error) {
        console.error('Failed to refetch insights:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [dispatch, token, isAuthenticated]);

  return <>{children}</>;
}

export function getSocket() {
  return socket;
}
