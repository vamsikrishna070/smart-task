import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/auth.js';

export const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', requireAuth, getCurrentUser);
