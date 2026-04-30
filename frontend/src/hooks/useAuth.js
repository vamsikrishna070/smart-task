import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'wouter';
import { setCredentials, logout } from '../store/authSlice.js';
import { api } from '../lib/api.js';

export const useAuth = () => {
  const dispatch = useDispatch();
  const [, navigate] = useRouter();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    const { user: userData, token: userToken } = await api.auth.login({
      email,
      password,
    });
    dispatch(setCredentials({ user: userData, token: userToken }));
    localStorage.setItem('taskflow_token', userToken);
    localStorage.setItem('taskflow_user', JSON.stringify(userData));
    return { user: userData, token: userToken };
  };

  const register = async (name, email, password) => {
    const { user: userData, token: userToken } = await api.auth.register({
      name,
      email,
      password,
    });
    dispatch(setCredentials({ user: userData, token: userToken }));
    localStorage.setItem('taskflow_token', userToken);
    localStorage.setItem('taskflow_user', JSON.stringify(userData));
    return { user: userData, token: userToken };
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    navigate('/login');
  };

  const checkAuth = async () => {
    try {
      const userData = await api.auth.getCurrentUser();
      dispatch(setCredentials({ user: userData, token }));
      return true;
    } catch (error) {
      dispatch(logout());
      return false;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout: handleLogout,
    checkAuth,
  };
};
