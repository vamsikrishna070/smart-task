import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import tasksReducer from './tasksSlice.js';
import insightsReducer from './insightsSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    insights: insightsReducer,
  },
});

export default store;
