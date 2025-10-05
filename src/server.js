/**
 * src/server.js
 * Entry point. Loads env, initializes DB, starts Express server.
 * Uses CommonJS modules.
 */

require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 4000;

// Connect to MongoDB first, then start server
(async function start() {
  try {
    await connectDB();
    const server = http.createServer(app);

    server.listen(PORT, () => {
      // Use console here; later phases will replace with Winston logger
      console.log(`ResQNet API listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('HTTP server closed.');
        // Close mongoose connection
        const mongoose = require('mongoose');
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed.');
          process.exit(0);
        });
      });

      // If still not closed in 10s, force exit
      setTimeout(() => {
        console.error('Forcing shutdown.');
        process.exit(1);
      }, 10000).unref();
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
