/**
 * Handles volunteer registration, profile updates and listing.
 */

const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/errors");
const { successResponse } = require("../utils/response");

// 🧩 1️⃣ Upgrade user → volunteer
exports.registerAsVolunteer = asyncHandler(async (req, res) => {
  const { skills, availability, radiusKm, idProofType, idProofUrl } = req.body;

  if (!skills || !radiusKm || !idProofType || !idProofUrl)
    throw new ApiError(400, "Missing volunteer profile fields");

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  user.role = "volunteer";
  user.volunteerProfile = {
    skills,
    availability: availability ?? true,
    radiusKm,
    verified: false,
    idProof: { type: idProofType, documentUrl: idProofUrl, verified: false },
    totalCasesResolved: 0,
    averageRating: 0,
    badges: [],
    joinedDate: new Date()
  };

  await user.save();
  return successResponse(res, "Upgraded to volunteer successfully", user);
});

// 🧩 2️⃣ Update volunteer profile
exports.updateVolunteerProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  const user = await User.findById(req.user._id);
  if (!user || user.role !== "volunteer")
    throw new ApiError(403, "Only volunteers can update their profile");

  Object.assign(user.volunteerProfile, updates);
  await user.save();
  return successResponse(res, "Volunteer profile updated", user);
});

// 🧩 3️⃣ List volunteers (admin only)
exports.listVolunteers = asyncHandler(async (req, res) => {
  const volunteers = await User.find({ role: "volunteer" }).select(
    "name email phone location volunteerProfile"
  );
  return successResponse(res, "Volunteers fetched successfully", volunteers);
});
