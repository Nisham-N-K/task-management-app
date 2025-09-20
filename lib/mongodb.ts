import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  // If a connection already exists, return it immediately.
  if (cached.conn) {
    console.log('✅ Using existing database connection.');
    return cached.conn;
  }

  // If a promise to connect doesn't exist yet, create one.
  if (!cached.promise) {
    console.log('⏳ Attempting to connect to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
    .then((mongooseInstance) => {
      // Log success message if the connection is successful.
      console.log('✅ MongoDB connection successful!');
      return mongooseInstance;
    })
    .catch((error) => {
      // Log the error if the connection fails.
      console.error('❌ MongoDB connection failed:', error.message);
      // Optional: re-throw the error to stop the app from running.
      throw error;
    });
  }

  // Await the connection promise and cache the connection object.
  cached.conn = await cached.promise;
  return cached.conn;
}