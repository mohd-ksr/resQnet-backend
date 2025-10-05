/**
 * src/config/cloudinary.js
 * Cloudinary configuration helper.
 *
 * NOTE: This exports a small helper object to upload files using cloudinary.v2.uploader
 * We'll use this in later phases for file uploads (profile images, audio reports).
 */

const cloudinary = require('cloudinary').v2;

const initCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn('Cloudinary credentials are not fully set. File uploads to Cloudinary will fail until configured.');
    return cloudinary;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true
  });

  return cloudinary;
};

module.exports = initCloudinary();
