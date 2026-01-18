const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware"); // JWT auth
const adminMiddleware = require("../middleware/admin"); // Admin check
const upload = require("../middleware/upload");

const {
  getAllServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

// 1️⃣ Get all services (public)
router.get("/", getAllServices);

// 2️⃣ Add a service (admin only)
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createService);

// 3️⃣ Update a service (admin only)
router.put("/:id",authMiddleware, adminMiddleware, upload.single("image"), updateService);

// 4️⃣ Delete a service (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteService);

module.exports = router;
