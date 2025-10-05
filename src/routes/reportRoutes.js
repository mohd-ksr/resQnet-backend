const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/authorizeRoles");
const {
  createReport,
  getReports,
  updateReportStatus
} = require("../controllers/reportController");

// 🧍 Any authenticated user can create reports
router.post("/", auth, authorizeRoles("user", "volunteer", "admin"), createReport);

// 👁️ Role-based access to reports (filtered in controller)
router.get("/", auth, authorizeRoles("user", "volunteer", "admin"), getReports);

// 🧩 Update report status
router.patch("/:id/status", auth, authorizeRoles("admin", "volunteer"), updateReportStatus);

module.exports = router;
