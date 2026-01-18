// models/Appointment.js
// Appointment schema for booking system

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // Who booked
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Which service is booked (single service for now)
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    // Date/time stored as strings (your current approach)
    date: { type: String, required: true }, // e.g. "2026-01-10"
    time: { type: String, required: true }, // e.g. "14:00"

    // Status (admin will update this)
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled"],
      default: "pending"
    },

    // Optional payment fields (safe even if you don’t use now)
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    transactionId: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
