const Appointment = require("../models/Appointment");
const Service = require("../models/Service");

/**
 * @desc   Book a new appointment (USER)
 * @route  POST /api/appointments
 * @access Private
 */
exports.bookAppointment = async (req, res) => {
  try {
    const { service, date, time } = req.body;

    if (!service || !date || !time) {
      return res.status(400).json({ message: "Service, date, and time are required" });
    }

    // Check if service exists
    const serviceExists = await Service.findById(service);
    if (!serviceExists) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Prevent double booking (same service, date, time)
    // Prevent double booking (same service, date, time) except canceled slots
    const existing = await Appointment.findOne({
      service,
      date,
      time,
      status: { $ne: "canceled" },
    });
    if (existing) {
      return res.status(400).json({ message: "This slot is already booked" });
    }


    const appointment = await Appointment.create({
      user: req.user.id,
      service,
      date,
      time
    });

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc   Get all appointments of logged-in user
 * @route  GET /api/appointments/my
 * @access Private
 */
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate("service", "name price duration")
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc   Cancel an appointment (USER)
 * @route  DELETE /api/appointments/:id
 * @access Private
 */
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await appointment.deleteOne();
    res.json({ message: "Appointment canceled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc   Admin: Get all appointments
 * @route  GET /api/appointments
 * @access Admin

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("user", "name email")
      .populate("service", "name price duration")
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 */
exports.getBookedSlots = async (req, res) => {
  try {
    const { date } = req.query;

    // ✅ Validate query
    if (!date) {
      return res.status(400).json({ message: "date query is required (YYYY-MM-DD)" });
    }

    // ✅ Only take real booked slots (ignore canceled)
    const appointments = await Appointment.find({
      date,
      status: { $ne: "canceled" }
    }).select("time");

    const bookedTimes = appointments.map((a) => a.time);

    res.json({ bookedTimes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
