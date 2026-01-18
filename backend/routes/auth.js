const express = require("express");
const router = express.Router();

// ✅ Controllers
const {
  register,
  verifyEmail,
  login,
  resendVerification
} = require("../controllers/authController");

// ✅ PUBLIC ROUTES (no token required)
router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/resend-verification", resendVerification);

module.exports = router;

