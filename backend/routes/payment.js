const express = require("express");
const router = express.Router();
const { startPayment, verifyPayment } = require("../controllers/paymentController");
const auth = require("../middleware/authMiddleware");

// Start payment
router.post("/start", auth, startPayment);

// Verify payment
router.post("/verify", auth, verifyPayment);

module.exports = router;
