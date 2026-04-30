import { verifyToken } from '../lib/jwt.js';
import { User } from '../models/User.js';

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
