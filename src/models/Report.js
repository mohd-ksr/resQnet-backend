/**
 * src/models/Report.js
 * Stores user-reported incidents with geolocation and volunteer assignment
 */

const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: { type: String, required: true, trim: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }
    },
    address: { type: String, trim: true },

    // ✅ These fields now come directly as strings from frontend
    emergencyType: {
      type: String,
      trim: true,
      required: true
      // No enum → allows NLP or manual input like "fire", "road accident", "gas leak"
    },
    priorityLevel: {
      type: String,
      trim: true,
      required: true
      // No enum → allows values like "critical", "medium", "urgent"
    },

    requiredSupplies: [{ type: String, trim: true }],

    status: {
      type: String,
      enum: ["pending", "assigned", "resolved"],
      default: "pending"
    },
    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

// Indexes
reportSchema.index({ location: "2dsphere" });
reportSchema.index({ status: 1 });
reportSchema.index({ emergencyType: 1 });

// Static examples

// Create report
reportSchema.statics.createReport = async function (data) {
  return this.create(data);
};

// Assign volunteer
reportSchema.statics.assignVolunteer = async function (reportId, volunteerId) {
  return this.findByIdAndUpdate(
    reportId,
    {
      assignedVolunteer: volunteerId,
      status: "assigned",
      updatedAt: new Date()
    },
    { new: true }
  );
};

// Mark resolved
reportSchema.statics.markResolved = async function (reportId) {
  return this.findByIdAndUpdate(
    reportId,
    { status: "resolved", updatedAt: new Date() },
    { new: true }
  );
};

module.exports = mongoose.model("Report", reportSchema);
