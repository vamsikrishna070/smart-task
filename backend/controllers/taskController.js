import { Task, calculatePriorityScore, isTaskOverdue } from '../models/Task.js';
import { getSocketIO } from '../lib/socket.js';

function formatTask(task) {
  const score = calculatePriorityScore({
    status: task.status,
    deadline: task.deadline,
    createdAt: task.createdAt,
  });
  return {
    id: task._id.toString(),
    taskId: task.taskId,
    title: task.title,
    description: task.description,
    category: task.category,
    status: task.status,
    priorityScore: score,
    deadline: task.deadline ?? null,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    userId: task.userId.toString(),
    isOverdue: isTaskOverdue({ status: task.status, deadline: task.deadline }),
  };
}

export async function getAllTasks(req, res) {
  try {
    const { status, category } = req.query;

    const filter = { userId: req.userId };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const rawTasks = await Task.find(filter).sort({ createdAt: 1 });
    const tasks = rawTasks
      .map(formatTask)
      .sort((a, b) => b.priorityScore - a.priorityScore);

    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;

    res.json({ tasks, total, pending, inProgress, completed });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
}

export async function createTask(req, res) {
  try {
    const { title, description, category, status, deadline } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!category || category.trim().length === 0) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const task = new Task({
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category.trim(),
      status: status || 'Pending',
      deadline: deadline ? new Date(deadline) : null,
      userId: req.userId,
    });

    task.priorityScore = calculatePriorityScore({
      status: task.status,
      deadline: task.deadline,
      createdAt: new Date(),
    });

    await task.save();
    const formatted = formatTask(task);

    const io = getSocketIO();
    if (io) {
      io.to(`user:${req.userId}`).emit('task:created', formatted);
      io.to(`user:${req.userId}`).emit('insights:updated');
    }

    res.status(201).json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
}

export async function getTaskById(req, res) {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(formatTask(task));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch task', error: error.message });
  }
}

export async function updateTask(req, res) {
  try {
    const { title, description, category, status, deadline } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields
    if (title !== undefined && title.trim().length > 0) task.title = title.trim();
    if (description !== undefined) task.description = description ? description.trim() : '';
    if (category !== undefined && category.trim().length > 0) task.category = category.trim();
    if (status !== undefined && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      task.status = status;
    }
    if (deadline !== undefined) task.deadline = deadline ? new Date(deadline) : null;

    // Recalculate priority
    task.priorityScore = calculatePriorityScore({
      status: task.status,
      deadline: task.deadline,
      createdAt: task.createdAt,
    });

    await task.save();
    const formatted = formatTask(task);

    const io = getSocketIO();
    if (io) {
      io.to(`user:${req.userId}`).emit('task:updated', formatted);
      io.to(`user:${req.userId}`).emit('insights:updated');
    }

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
}

export async function deleteTask(req, res) {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const io = getSocketIO();
    if (io) {
      io.to(`user:${req.userId}`).emit('task:deleted', { id: req.params.id });
      io.to(`user:${req.userId}`).emit('insights:updated');
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
}
