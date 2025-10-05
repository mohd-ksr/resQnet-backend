/**
 * src/app.js
 * Express application setup and middleware registration.
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();

// Basic security middlewares
app.use(helmet());

// CORS - in prod, tighten origins to allowed domains
app.use(cors({
  origin: true,
  credentials: true
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser for refresh token cookies
app.use(cookieParser(process.env.COOKIE_SECRET || 'please_change_cookie_secret'));

// Basic rate limiter - this will be enhanced in PART 6
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // limit each IP to 120 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});
app.use(apiLimiter);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ResQNet API is healthy',
    data: {
      env: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }
  });
});

// ✅ Test routes for unified response helper
const { successResponse, errorResponse } = require('./utils/response');
const asyncHandler = require('./utils/asyncHandler');
const ApiError = require('./utils/errors');

// ✅ test success
app.get('/api/test/success', (req, res) => {
  return successResponse(res, "Success route working!", { name: "Roy", project: "ResQNet" });
});

// ✅ test error (direct)
app.get('/api/test/error', (req, res) => {
  return errorResponse(res, 400, "Bad Request - just a test");
});

// ✅ test with asyncHandler + ApiError
app.get('/api/test/exception', asyncHandler(async (req, res) => {
  throw new ApiError(500, "Simulated server crash 😅");
}));

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});


// 🧩 ✅ TEMPORARY GLOBAL ERROR HANDLER
// (To show JSON instead of HTML when async errors are thrown)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});


// Export app
module.exports = app;
