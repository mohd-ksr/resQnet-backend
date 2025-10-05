/**
 * Placeholder for future notifications (SMS / Email / Push)
 */
exports.notifyVolunteer = async (volunteer, report) => {
  console.log(
    `📢 Notify ${volunteer.name} about new report ${report._id} at ${report.address}`
  );
};
