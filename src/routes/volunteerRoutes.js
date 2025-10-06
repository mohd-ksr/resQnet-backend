/**
 * src/routes/volunteerRoutes.js
 */
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const authorizeRoles = require("../middlewares/authorizeRoles");
const {
  registerAsVolunteer,
  updateVolunteerProfile,
  listVolunteers
} = require("../controllers/volunteerController");

// 📸 Volunteer registration with ID proof upload
router.post(
  "/register",
  auth,
  authorizeRoles("user"),
  upload.single("idProof"),
  registerAsVolunteer
);

// ✏️ Volunteer profile update
router.patch(
  "/update",
  auth,
  authorizeRoles("volunteer"),
  updateVolunteerProfile
);

// 👁️ Admin-only volunteer listing
router.get(
  "/",
  auth,
  authorizeRoles("admin"),
  listVolunteers
);

module.exports = router;
