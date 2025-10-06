/**
 * src/middlewares/rateLimiter.js
 * Simple rate limiting middleware for abuse prevention.
 */

const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // max requests per window per IP
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = rateLimiter;
