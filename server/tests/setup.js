import mongoose from 'mongoose';
import { beforeAll, afterAll } from 'vitest';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore DNS config errors
}


beforeAll(async () => {
  const localUri = 'mongodb://127.0.0.1:27017/craftlk';
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(localUri, { serverSelectionTimeoutMS: 3000 });
    } catch (err) {
      console.warn('[Test DB Connection]:', err.message);
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});
