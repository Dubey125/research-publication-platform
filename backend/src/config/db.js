import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing in environment variables.');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      // Keeps connections alive across serverless cold starts (Render/Railway)
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} — DB: ${conn.connection.name}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Failed: ${err.message}`);
    process.exit(1);
  }

  // Graceful disconnection
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected.');
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed (SIGINT). Server shutting down.');
    process.exit(0);
  });
};

export default connectDB;
