const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
 // optional for admin-only routes
const adminMiddleware = require("../middleware/admin");


const {
  getAllAppointmentsAdmin,
  updateAppointmentStatus
} = require("../controllers/adminAppointmentsController");

const {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getBookedSlots
} = require("../controllers/appointmentController");

// USER routes
router.post("/", authMiddleware, bookAppointment);
router.get("/my", authMiddleware, getMyAppointments);


// ========================================
// booked
router.get("/booked", authMiddleware, getBookedSlots);
// /:id routes last
router.delete("/:id", authMiddleware, cancelAppointment);


// ========================================
// Admin: Get all appointments
router.get("/", authMiddleware, adminMiddleware, getAllAppointmentsAdmin);

// Admin: Update appointment status
router.put("/:id/status", authMiddleware, adminMiddleware, updateAppointmentStatus);

module.exports = router;
