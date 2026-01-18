const fs = require("fs");
const multer = require("multer");
const path = require("path");

/*
  ===================================
  MULTER CONFIG FOR IMAGE UPLOAD
  ===================================
*/

const uploadsDir = process.env.UPLOADS_DIR || "uploads";

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage location & file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // folder where images are saved
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValid =
    allowedTypes.test(file.mimetype) &&
    allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, webp)"));
  }
};

// Upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

module.exports = upload;
