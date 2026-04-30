import express from 'express';
import { getDashboardInsights, getCategoryDistribution } from '../controllers/insightsController.js';
import { requireAuth } from '../middlewares/auth.js';

export const insightsRouter = express.Router();

insightsRouter.use(requireAuth);

insightsRouter.get('/', getDashboardInsights);
insightsRouter.get('/categories', getCategoryDistribution);
