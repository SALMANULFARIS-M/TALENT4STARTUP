import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { GridFSBucket } from 'mongodb';

dotenv.config();

// MongoDB connection settings
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

// Initialize GridFS bucket reference
let gfsBucket = null;

const connectDB = async (retryCount = 0) => {
  // Validate environment variable
  if (!process.env.MONGODBSERVER) {
    console.error('❌ MONGODBSERVER environment variable is not defined');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODBSERVER);

    // Initialize GridFS bucket after successful connection
    gfsBucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'resumes',
      chunkSizeBytes: 1024 * 1024, // 1MB chunks (default)
    });

    console.log('✅ MongoDB connected successfully');
    console.log('✅ GridFS bucket initialized for "resumes"');
  } catch (error) {
    console.error(`❌ MongoDB connection error (Attempt ${retryCount + 1}):`, error.message);

    // Retry connection if max retries not reached
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
      setTimeout(() => connectDB(retryCount + 1), RETRY_DELAY);
    } else {
      console.error('❌ Maximum retries reached. Exiting...');
      process.exit(1);
    }
  }
};

// MongoDB event listeners
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
  // Reinitialize GridFS if connection is restored
  if (mongoose.connection.db && !gfsBucket) {
    gfsBucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'resumes'
    });
  }
});

mongoose.connection.on('disconnected', () => {
  console.log('❌ MongoDB disconnected');
  // Clear GridFS reference
  gfsBucket = null;
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

// Utility function to get the GridFS bucket
const getGridFSBucket = () => {
  if (!gfsBucket) {
    throw new Error('GridFS bucket not initialized. Check MongoDB connection.');
  }
  return gfsBucket;
};

export { connectDB, getGridFSBucket };