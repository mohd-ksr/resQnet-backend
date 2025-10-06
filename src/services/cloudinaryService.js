/**
 * src/services/cloudinaryService.js
 * Unified Cloudinary uploader/deleter service.
 */
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const logger = require("../utils/logger");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (localFilePath, folder = "uploads") => {
  try {
    if (!localFilePath) throw new Error("No file path provided");
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "auto"
    });
    fs.unlinkSync(localFilePath); // remove temp file
    logger.info(`Uploaded to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    logger.error("Cloudinary upload failed: " + err.message);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    throw err;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    logger.info(`Deleted from Cloudinary: ${publicId}`);
    return res;
  } catch (err) {
    logger.error("Cloudinary delete failed: " + err.message);
    throw err;
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
