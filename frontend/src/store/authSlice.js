import { createSlice } from '@reduxjs/toolkit';

const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('taskflow_token') : null;

const initialState = {
  user: null,
  token: storedToken,
  isAuthenticated: !!storedToken,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('taskflow_token', action.payload.token);
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('taskflow_token');
      }
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
