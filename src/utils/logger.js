/**
 * src/utils/logger.js
 * Enhanced Winston logger for ResQNet backend.
 * - Logs errors and info to console + rotating files
 * - Colorized output for dev
 * - Includes timestamps and request context
 */

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;
const path = require('path');
require('winston-daily-rotate-file');

// Custom log format with timestamps and optional stack traces
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Log rotation (keeps 7 days of logs, 10MB each)
const fileRotateTransport = new transports.DailyRotateFile({
  filename: path.join(__dirname, '../logs/resqnet-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '10m',
  maxFiles: '7d',
  zippedArchive: true,
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }), // Capture stack traces
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    fileRotateTransport,
    new transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error'
    }),
    new transports.File({
      filename: path.join(__dirname, '../logs/combined.log')
    })
  ],
});

// Add colorful console logs only in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(
        colorize(),
        errors({ stack: true }),
        timestamp({ format: 'HH:mm:ss' }),
        logFormat
      )
    })
  );
}

// Helper for attaching request info
logger.httpLog = (req, statusCode) => {
  logger.info(`${req.method} ${req.originalUrl} → ${statusCode}`);
};

module.exports = logger;
