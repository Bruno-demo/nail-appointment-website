// adminAppointmentsController.js
// Admin actions for managing appointments.

const Appointment = require("../models/Appointment");

/**
 * @desc   Get all appointments (admin)
 * @route  GET /api/appointments
 * @access Admin
 */
exports.getAllAppointmentsAdmin = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate("user", "name email phone")
      .populate("service", "name price duration bookingFee")
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to load appointments", error: err.message });
  }
};

/**
 * @desc   Update appointment status (admin)
 * @route  PUT /api/appointments/:id/status
 * @access Admin
 */
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "confirmed", "canceled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Use: ${allowed.join(", ")}`
      });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = status;
    await appointment.save();

    res.json({ message: "Appointment updated", appointment });
  } catch (err) {
    res.status(500).json({ message: "Failed to update appointment", error: err.message });
  }
};
