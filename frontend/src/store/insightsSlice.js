import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  inProgressTasks: 0,
  completedToday: 0,
  dailyActivityCount: 0,
  mostActiveCategory: 'None',
  overdueTasks: 0,
  completionRate: 0,
  categories: [],
};

export const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    setInsights: (state, action) => {
      state.totalTasks = action.payload.totalTasks;
      state.completedTasks = action.payload.completedTasks;
      state.pendingTasks = action.payload.pendingTasks;
      state.inProgressTasks = action.payload.inProgressTasks;
      state.completedToday = action.payload.completedToday;
      state.dailyActivityCount = action.payload.dailyActivityCount;
      state.mostActiveCategory = action.payload.mostActiveCategory;
      state.overdueTasks = action.payload.overdueTasks;
      state.completionRate = action.payload.completionRate;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const { setInsights, setCategories } = insightsSlice.actions;
export default insightsSlice.reducer;
