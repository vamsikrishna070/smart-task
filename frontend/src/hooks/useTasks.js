import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import {
  setTasks,
  addTask,
  updateTask,
  removeTask,
  setLoading,
  setError,
} from '../store/tasksSlice.js';
import { api } from '../lib/api.js';

export const useTasks = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await api.tasks.getAll();
      dispatch(setTasks(data));
    } catch (err) {
      setApiError(err.message);
      dispatch(setError(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await api.tasks.create(taskData);
      dispatch(addTask(newTask));
      return newTask;
    } catch (err) {
      setApiError(err.message);
      throw err;
    }
  };

  const editTask = async (taskId, taskData) => {
    try {
      const updatedTask = await api.tasks.update(taskId, taskData);
      dispatch(updateTask(updatedTask));
      return updatedTask;
    } catch (err) {
      setApiError(err.message);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.tasks.delete(taskId);
      dispatch(removeTask(taskId));
    } catch (err) {
      setApiError(err.message);
      throw err;
    }
  };

  return {
    tasks,
    loading: isLoading || loading,
    error: apiError || error,
    fetchTasks,
    createTask,
    editTask,
    deleteTask,
  };
};
