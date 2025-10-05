/**
 * Finds nearby volunteers based on a report location and radius.
 */
const User = require("../models/User");

exports.findNearbyVolunteers = async (reportLocation, radiusKm) => {
  const volunteers = await User.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: reportLocation.coordinates },
        distanceField: "distance",
        spherical: true,
        maxDistance: radiusKm * 1000,
        query: { role: "volunteer", "volunteerProfile.availability": true }
      }
    },
    { $limit: 10 }
  ]);
  return volunteers;
};
