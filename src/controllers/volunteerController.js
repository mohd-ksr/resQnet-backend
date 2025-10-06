/**
 * src/controllers/volunteerController.js
 * Handles volunteer registration, profile updates and listing.
 */

const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/errors");
const { successResponse } = require("../utils/response");
const { uploadToCloudinary } = require("../services/cloudinaryService");

// 🧩 1️⃣ Upgrade user → volunteer (with Cloudinary ID proof upload)
exports.registerAsVolunteer = asyncHandler(async (req, res) => {
  const { skills, availability, radiusKm, idProofType } = req.body;

  // Ensure essential data
  if (!skills || !radiusKm || !idProofType)
    throw new ApiError(400, "Missing required volunteer profile fields");

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  // Ensure ID proof file uploaded
  if (!req.file) throw new ApiError(400, "ID proof image is required");

  // Upload file to Cloudinary (folder: id_proofs)
  const idProofUrl = await uploadToCloudinary(req.file.path, "id_proofs");

  // Update user data
  user.role = "volunteer";
  user.volunteerProfile = {
    skills,
    availability: availability ?? true,
    radiusKm,
    verified: false,
    idProof: {
      type: idProofType,
      documentUrl: idProofUrl,
      verified: false
    },
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
