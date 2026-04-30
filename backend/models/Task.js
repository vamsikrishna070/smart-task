import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const taskSchema = new mongoose.Schema(
  {
    taskId: { type: String, default: () => uuidv4(), unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    priorityScore: { type: Number, default: 0 },
    deadline: { type: Date, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export function calculatePriorityScore(task) {
  if (task.status === 'Completed') return 0;

  const now = new Date();
  let score = 10;

  if (task.deadline) {
    const deadlineMs = task.deadline.getTime() - now.getTime();
    const deadlineHours = deadlineMs / (1000 * 60 * 60);

    if (deadlineHours < 0) {
      score = 100 + Math.abs(deadlineHours) * 0.1;
    } else if (deadlineHours < 6) {
      score = 95;
    } else if (deadlineHours < 24) {
      score = 85;
    } else if (deadlineHours < 48) {
      score = 70;
    } else if (deadlineHours < 72) {
      score = 55;
    } else if (deadlineHours < 168) {
      score = 40;
    } else {
      score = 20;
    }
  }

  const ageMs = now.getTime() - task.createdAt.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  score += ageDays * 0.01;

  return Math.round(score * 100) / 100;
}

export function isTaskOverdue(task) {
  if (task.status === 'Completed') return false;
  if (!task.deadline) return false;
  return new Date(task.deadline) < new Date();
}

export const Task = mongoose.model('Task', taskSchema);
