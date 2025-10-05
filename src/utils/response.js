/**
 * Unified response helpers for success and error cases.
 */

exports.successResponse = (res, message = 'Success', data = {}) => {
  return res.status(200).json({
    success: true,
    message,
    data
  });
};

exports.errorResponse = (res, statusCode = 500, message = 'Internal Server Error') => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};
