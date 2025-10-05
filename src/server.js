

/**
 * src/server.js
 * Entry point. Loads env, initializes DB, starts Express server.
 * Uses CommonJS modules.
 */

require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger'); // ✅ Winston logger

const PORT = process.env.PORT || 4000;

// Connect to MongoDB first, then start server
(async function start() {
  try {
    await connectDB();
    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info(`🚀 ResQNet API listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Graceful shutdown handler
    const shutdown = (signal) => {
      logger.warn(`\nReceived ${signal}. Shutting down gracefully...`);

      server.close(() => {
        logger.info('🛑 HTTP server closed.');

        // Close mongoose connection
        const mongoose = require('mongoose');
        mongoose.connection.close(false, () => {
          logger.info('🗃️ MongoDB connection closed.');
          process.exit(0);
        });
      });

      // Force exit if shutdown takes too long
      setTimeout(() => {
        logger.error('⚠️ Forced shutdown due to timeout.');
        process.exit(1);
      }, 10000).unref();
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (err) {
    logger.error(`❌ Failed to start server: ${err.message}`);
    process.exit(1);
  }
})();

