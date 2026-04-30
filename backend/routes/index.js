import express from 'express';
import healthRouter from './health.js';
import { authRouter } from './auth.js';
import { tasksRouter } from './tasks.js';
import { insightsRouter } from './insights.js';

const router = express.Router();

router.use(healthRouter);
router.use('/auth', authRouter);
router.use('/tasks', tasksRouter);
router.use('/insights', insightsRouter);

export default router;
