/**
 * src/middlewares/errorHandler.js
 * Centralized error handling middleware.
 */

const logger = require("../utils/logger");
const ApiError = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  logger.error(`[${req.method}] ${req.url} - ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message =
    err instanceof ApiError
      ? err.message
      : "Internal Server Error. Please try again later.";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
