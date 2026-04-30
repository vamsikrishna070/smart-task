import express from 'express';
import {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { requireAuth } from '../middlewares/auth.js';

export const tasksRouter = express.Router();

tasksRouter.use(requireAuth);

tasksRouter.get('/', getAllTasks);
tasksRouter.post('/', createTask);
tasksRouter.get('/:id', getTaskById);
tasksRouter.patch('/:id', updateTask);
tasksRouter.delete('/:id', deleteTask);
