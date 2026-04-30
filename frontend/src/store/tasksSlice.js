import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
  loading: false,
  error: null,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload.tasks;
      state.total = action.payload.total;
      state.pending = action.payload.pending;
      state.inProgress = action.payload.inProgress;
      state.completed = action.payload.completed;
    },
    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
      state.total++;
      if (action.payload.status === 'Pending') state.pending++;
      else if (action.payload.status === 'In Progress') state.inProgress++;
      else if (action.payload.status === 'Completed') state.completed++;
      state.tasks.sort((a, b) => b.priorityScore - a.priorityScore);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        const oldTask = state.tasks[index];
        state.tasks[index] = action.payload;
        
        if (oldTask.status !== action.payload.status) {
          if (oldTask.status === 'Pending') state.pending--;
          else if (oldTask.status === 'In Progress') state.inProgress--;
          else if (oldTask.status === 'Completed') state.completed--;
          
          if (action.payload.status === 'Pending') state.pending++;
          else if (action.payload.status === 'In Progress') state.inProgress++;
          else if (action.payload.status === 'Completed') state.completed++;
        }
        
        state.tasks.sort((a, b) => b.priorityScore - a.priorityScore);
      }
    },
    removeTask: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        if (task.status === 'Pending') state.pending--;
        else if (task.status === 'In Progress') state.inProgress--;
        else if (task.status === 'Completed') state.completed--;
        state.total--;
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setTasks, addTask, updateTask, removeTask, setLoading, setError } = tasksSlice.actions;
export default tasksSlice.reducer;
