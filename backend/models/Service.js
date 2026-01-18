const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    bookingFee: { type: Number, required: true },
    duration: { type: Number, required: true }, // in minutes
    image: { type: String, required: true } // stores filename/path
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
