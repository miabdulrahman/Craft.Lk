import mongoose from 'mongoose';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

export const connectDB = async (uri) => {
  const primaryUri = uri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/craftlk';
  const fallbackUri = 'mongodb://127.0.0.1:27017/craftlk';

  try {
    const conn = await mongoose.connect(primaryUri);
    console.log(`[MongoDB] Connected successfully to primary: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to primary URI (${error.message}).`);
    if (primaryUri !== fallbackUri) {
      console.log(`[MongoDB] Attempting fallback to local instance at ${fallbackUri}...`);
      try {
        const fallbackConn = await mongoose.connect(fallbackUri);
        console.log(`[MongoDB] Connected successfully to local fallback: ${fallbackConn.connection.host}/${fallbackConn.connection.name}`);
        return fallbackConn;
      } catch (fallbackError) {
        console.error(`[MongoDB Fatal Error] Local fallback also failed: ${fallbackError.message}`);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};
