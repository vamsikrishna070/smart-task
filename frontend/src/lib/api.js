const API_BASE_URL = 'http://localhost:3000/api';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('taskflow_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    window.location.href = '/login';
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
};

export const api = {
  auth: {
    register: (data) => apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    login: (data) => apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getCurrentUser: () => apiCall('/auth/me'),
  },
  tasks: {
    getAll: () => apiCall('/tasks'),
    getById: (id) => apiCall(`/tasks/${id}`),
    create: (data) => apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => apiCall(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id) => apiCall(`/tasks/${id}`, {
      method: 'DELETE',
    }),
  },
  insights: {
    getDashboard: () => apiCall('/insights'),
    getCategories: () => apiCall('/insights/categories'),
  },
};
