/**
 * src/controllers/authController.js
 * Handles register, login, refresh, logout, and profile.
 */

const bcrypt = require("bcrypt");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/errors");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} = require("../utils/jwt");
const { successResponse } = require("../utils/response");
const { uploadToCloudinary } = require("../services/cloudinaryService");


exports.updateProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image uploaded");
  const imageUrl = await uploadToCloudinary(req.file.path, "profile_images");
  req.user.profileImage = imageUrl;
  await req.user.save();
  return successResponse(res, "Profile image updated successfully", { imageUrl });
});

const generateAccessAndRefreshToken = async (user) => {
  const accessToken = signAccessToken({ _id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ _id: user._id, role: user.role });

  return { accessToken, refreshToken };
};

// Register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, "User already exists");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    phone,
    passwordHash
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return successResponse(res, "User registered successfully", {
    accessToken,
    user
  });
});

// Login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new ApiError(400, "Invalid email or password");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return successResponse(res, "Login successful", {
    accessToken,
    user
  });
});

// Refresh Access Token
exports.refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new ApiError(401, "No refresh token found");

  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded._id);
  if (!user) throw new ApiError(401, "User not found");

  const accessToken = signAccessToken({ _id: user._id, role: user.role });
  return successResponse(res, "Access token refreshed", { accessToken });
});

// Logout
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken");
  return successResponse(res, "Logged out successfully");
});

// Get Profile
exports.getProfile = asyncHandler(async (req, res) => {
  return successResponse(res, "Profile fetched", { user: req.user });
});
