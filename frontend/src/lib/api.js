const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const getToken = () => localStorage.getItem('taskflow_token');

const request = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
};

export const api = {
  auth: {
    login: (credentials) =>
      request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData) =>
      request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    getCurrentUser: () =>
      request('/api/auth/me', {
        method: 'GET',
      }),
  },
  tasks: {
    getAll: () =>
      request('/api/tasks', {
        method: 'GET',
      }),
    create: (taskData) =>
      request('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      }),
    update: (id, taskData) =>
      request(`/api/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData),
      }),
    delete: (id) =>
      request(`/api/tasks/${id}`, {
        method: 'DELETE',
      }),
  },
  insights: {
    get: () =>
      request('/api/insights', {
        method: 'GET',
      }),
  },
};

export const getApiUrl = (path) => `${API_BASE_URL}${path}`;
