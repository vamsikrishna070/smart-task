import { Server as SocketIOServer } from 'socket.io';
import { logger } from '../config/logger.js';

import { verifyToken } from './jwt.js';

let io = null;

export function initSocketIO(server) {
  io = new SocketIOServer(server, {
    path: '/socket.io',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const payload = verifyToken(token);
      socket.userId = payload.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    socket.join(`user:${userId}`);
    logger.info({ socketId: socket.id, userId }, 'Socket.io client connected and joined user room');
    
    socket.on('disconnect', () => {
      logger.info({ socketId: socket.id, userId }, 'Socket.io client disconnected');
    });
  });

  return io;
}

export function getSocketIO() {
  return io;
}
