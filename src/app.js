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

// Placeholder for future routers (auth, reports, volunteers, etc.)
// e.g. const authRoutes = require('./routes/authRoutes');
// app.use('/api/auth', authRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Note: centralized error handler middleware will be added in PART 6

module.exports = app;
