import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'fallback-secret-change-in-prod';
const JWT_EXPIRES_IN = '7d';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
