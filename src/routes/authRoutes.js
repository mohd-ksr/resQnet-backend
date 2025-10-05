/**
 * src/routes/authRoutes.js
 * Routes for user authentication.
 */

const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  register,
  login,
  refreshAccessToken,
  logout,
  getProfile
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);
router.get("/me", auth, getProfile);

module.exports = router;
