/**
 * src/middlewares/auth.js
 * Middleware to verify JWT access tokens and attach user to request.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/errors");

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new ApiError(401, "No access token provided");
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded._id).select("-passwordHash");
    if (!user) throw new ApiError(401, "User not found");

    req.user = user;
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

module.exports = auth;
