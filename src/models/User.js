/**
 * src/models/User.js
 * Mongoose schema for all users (includes volunteers and admins)
 */

const mongoose = require("mongoose");

const idProofSchema = new mongoose.Schema({
  type: { type: String, trim: true },
  documentUrl: { type: String, trim: true },
  verified: { type: Boolean, default: false }
});

const volunteerProfileSchema = new mongoose.Schema({
  skills: [{ type: String, trim: true }],
  availability: { type: Boolean, default: false },
  radiusKm: { type: Number, default: 5 },
  verified: { type: Boolean, default: false },
  idProof: { type: idProofSchema, default: null },
  totalCasesResolved: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  badges: [{ type: String, trim: true }],
  joinedDate: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "volunteer", "admin"],
      default: "user"
    },
    profileImage: { type: String, default: "" },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
    },
    volunteerProfile: { type: volunteerProfileSchema, default: null }
  },
  { timestamps: true }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ location: "2dsphere" });

// Helper: Promote user → volunteer
userSchema.statics.promoteToVolunteer = async function (userId, data) {
  return this.findByIdAndUpdate(
    userId,
    {
      role: "volunteer",
      volunteerProfile: {
        ...data,
        verified: false,
        joinedDate: new Date()
      }
    },
    { new: true }
  );
};

// Example: find nearby volunteers
userSchema.statics.findNearbyVolunteers = async function (lng, lat, radiusKm) {
  return this.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [lng, lat] },
        distanceField: "distance",
        maxDistance: radiusKm * 1000, // km → meters
        query: { role: "volunteer", "volunteerProfile.availability": true },
        spherical: true
      }
    }
  ]);
};

module.exports = mongoose.model("User", userSchema);
