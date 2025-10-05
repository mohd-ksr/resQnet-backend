/**
 * src/config/db.js
 * Mongoose connection helper.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI not set in environment');
  }

  // Recommended options for modern Mongoose versions
  const opts = {
    dbName: process.env.MONGO_DBNAME || undefined,
    autoIndex: false, // production: set to false, use migrations or ensureIndexes separately
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
  };

  try {
    await mongoose.connect(mongoUri, opts);
    console.log('✅ MongoDB connected');
    // Optional: log connection events
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

module.exports = connectDB;
