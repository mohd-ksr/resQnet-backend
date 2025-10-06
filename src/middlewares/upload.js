/**
 * src/middlewares/upload.js
 * Multer setup for handling uploads before Cloudinary transfer.
 */
const multer = require("multer");
const path = require("path");
const ApiError = require("../utils/errors");

// Allowed MIME types
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedAudioTypes = ["audio/mpeg", "audio/wav", "audio/mp4"];

// Local temp storage (files removed after Cloudinary upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/temp");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const isImage = allowedImageTypes.includes(file.mimetype);
  const isAudio = allowedAudioTypes.includes(file.mimetype);
  if (!isImage && !isAudio) {
    return cb(new ApiError(400, "Invalid file type. Only images or audio allowed."));
  }
  cb(null, true);
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

module.exports = upload;
