// /**
//  * src/routes/authRoutes.js
//  * Routes for user authentication.
//  */

// const express = require("express");
// const router = express.Router();
// const auth = require("../middlewares/auth");
// const {
//   register,
//   login,
//   refreshAccessToken,
//   logout,
//   getProfile
// } = require("../controllers/authController");

// router.post("/register", register);
// router.post("/login", login);
// router.post("/refresh", refreshAccessToken);
// router.post("/logout", logout);
// router.get("/me", auth, getProfile);

// module.exports = router;






/**
 * src/routes/authRoutes.js
 * Handles user authentication: register, login, refresh, logout, profile.
 */

const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");

const {
  register,
  login,
  refreshAccessToken,
  logout,
  getProfile,
  updateProfileImage
} = require("../controllers/authController");

// 🧩 Joi Schemas for Validation
const registerSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters"
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address"
  }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    "string.empty": "Phone number is required",
    "string.pattern.base": "Phone number must be exactly 10 digits"
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters"
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format"
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters"
  })
});

// 🧍 Public Routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

// 👤 Protected Route (requires authentication)
router.get("/me", auth, getProfile);
const upload = require("../middlewares/upload");
router.post("/upload-profile", auth, upload.single("image"), updateProfileImage);


module.exports = router;
