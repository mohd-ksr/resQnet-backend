/**
 * src/middlewares/authorizeRoles.js
 * Restricts route access based on user roles.
 */

const ApiError = require("../utils/errors");

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!allowedRoles.includes(userRole)) {
        throw new ApiError(403, "Access denied: insufficient permissions");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = authorizeRoles;
