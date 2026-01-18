const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    isAdmin: { type: Boolean, default: false },

    isVerified: { type: Boolean, default: false },

    verificationToken: String,
    verificationTokenExpires: Date   // ✅ ADD THIS
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
