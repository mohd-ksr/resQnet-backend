/**
 * Wraps async route handlers and forwards errors to Express.
 * Prevents repetitive try/catch in controllers.
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
