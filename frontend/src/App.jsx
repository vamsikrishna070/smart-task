import React, { useEffect } from 'react';
import { Router, Route, Redirect } from 'wouter';
import { useSelector, useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import { setCredentials } from './store/authSlice.js';

// Pages
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Dashboard from './pages/dashboard.jsx';
import Tasks from './pages/tasks.jsx';
import TaskForm from './pages/task-form.jsx';
import NotFound from './pages/not-found.jsx';

// Providers
import AuthProvider from './components/auth/auth-provider.jsx';
import SocketProvider from './components/providers/socket-provider.jsx';
import AppLayout from './components/layout/app-layout.jsx';

// UI Components
import { Toaster } from './components/ui/toast-manager.jsx';

function ProtectedRoute({ component: Component }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function AppRoutes() {
  return (
    <Router>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute component={() => (
            <AppLayout>
              <Dashboard />
            </AppLayout>
          )} />
        )}
      </Route>

      <Route path="/tasks">
        {() => (
          <ProtectedRoute component={() => (
            <AppLayout>
              <Tasks />
            </AppLayout>
          )} />
        )}
      </Route>

      <Route path="/tasks/new">
        {() => (
          <ProtectedRoute component={() => (
            <AppLayout>
              <TaskForm />
            </AppLayout>
          )} />
        )}
      </Route>

      <Route path="/tasks/:id/edit">
        {({ id }) => (
          <ProtectedRoute component={() => (
            <AppLayout>
              <TaskForm />
            </AppLayout>
          )} />
        )}
      </Route>

      <Route path="/">
        {() => {
          const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
          if (isAuthenticated) {
            return <Redirect to="/dashboard" />;
          }
          return <Redirect to="/login" />;
        }}
      </Route>

      <Route component={NotFound} />
    </Router>
  );
}

export default function App({ store }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
          <Toaster />
        </SocketProvider>
      </AuthProvider>
    </Provider>
  );
}
