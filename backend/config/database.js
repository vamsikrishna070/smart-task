import mongoose from 'mongoose';
import { logger } from './logger.js';

let isConnected = false;

export async function connectMongoDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  try {
    await mongoose.connect(uri, {
      tls: true,
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error({ err }, 'Failed to connect to MongoDB');
    throw err;
  }
}

export { mongoose };
