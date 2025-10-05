/**
 * src/controllers/reportController.js
 * Handles creation, fetching, and status updates of reports.
 */

const Report = require("../models/Report");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/errors");
const { successResponse } = require("../utils/response");

// 🧩 1️⃣ Create new report (any authenticated user)
exports.createReport = asyncHandler(async (req, res) => {
  const { text, location, address, emergencyType, priorityLevel, requiredSupplies } = req.body;

  if (!text || !location || !emergencyType || !priorityLevel) {
    throw new ApiError(400, "Missing required fields");
  }

  const report = await Report.create({
    reporter: req.user._id,
    text,
    location,
    address,
    emergencyType,
    priorityLevel,
    requiredSupplies,
    status: "pending"
  });

  return successResponse(res, "Report created successfully", report);
});

// 🧩 2️⃣ Get reports (role-based filtering)
exports.getReports = asyncHandler(async (req, res) => {
  const role = req.user.role;
  let filter = {};

  if (role === "user") {
    // User can only view their own reports
    filter = { reporter: req.user._id };
  } else if (role === "volunteer") {
    // Volunteer sees only reports assigned to them
    filter = { assignedVolunteer: req.user._id };
  }
  // Admin sees all (filter remains {})

  const reports = await Report.find(filter)
    .populate("reporter", "name email phone")
    .populate("assignedVolunteer", "name email phone");

  return successResponse(res, "Reports fetched successfully", reports);
});

// 🧩 3️⃣ Update report status (admin or assigned volunteer)
exports.updateReportStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, assignedVolunteer } = req.body;
  const role = req.user.role;

  const report = await Report.findById(id);
  if (!report) throw new ApiError(404, "Report not found");

  // ✅ Admin logic
  if (role === "admin") {
    if (assignedVolunteer) report.assignedVolunteer = assignedVolunteer;
    if (status) report.status = status;
  }

  // ✅ Volunteer logic
  else if (role === "volunteer") {
    // Can only resolve *their assigned* reports
    if (String(report.assignedVolunteer) !== String(req.user._id)) {
      throw new ApiError(403, "You can only update reports assigned to you");
    }
    if (status === "resolved") report.status = "resolved";
    else throw new ApiError(403, "Volunteers can only mark reports as resolved");
  }

  // ❌ Users cannot update status
  else {
    throw new ApiError(403, "Only admin or assigned volunteer can update reports");
  }

  await report.save();
  const populated = await report.populate([
    { path: "reporter", select: "name email" },
    { path: "assignedVolunteer", select: "name email" }
  ]);

  return successResponse(res, "Report updated successfully", populated);
});
