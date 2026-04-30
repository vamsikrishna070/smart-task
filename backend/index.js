import 'dotenv/config.js';
import { createServer } from 'http';
import app from './app.js';
import { logger } from './config/logger.js';
import { connectMongoDB } from './config/database.js';
import { initSocketIO } from './lib/socket.js';

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error('PORT environment variable is required but was not provided.');
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const httpServer = createServer(app);
initSocketIO(httpServer);

async function start() {
  try {
    await connectMongoDB();
    httpServer.listen(port, () => {
      logger.info({ port }, 'Server listening');
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

start();
