import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI!;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};
