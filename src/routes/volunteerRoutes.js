const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/authorizeRoles");
const {
  registerAsVolunteer,
  updateVolunteerProfile,
  listVolunteers
} = require("../controllers/volunteerController");

// User upgrades → volunteer
router.post("/register", auth, authorizeRoles("user"), registerAsVolunteer);

// Volunteer updates own profile
router.patch("/update", auth, authorizeRoles("volunteer"), updateVolunteerProfile);

// Admin lists all volunteers
router.get("/", auth, authorizeRoles("admin"), listVolunteers);

module.exports = router;
