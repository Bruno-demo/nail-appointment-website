// adminUsersController.js
// Admin actions for managing users.

const User = require("../models/User");

/**
 * @desc   Get all users (admin)
 * @route  GET /api/users
 * @access Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Do not send password hashes to frontend
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to load users", error: err.message });
  }
};

/**
 * @desc   Set/unset admin for a user (admin)
 * @route  PUT /api/users/:id/admin
 * @access Admin
 */
exports.setUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;

    // basic validation
    if (typeof isAdmin !== "boolean") {
      return res.status(400).json({ message: "isAdmin must be true/false" });
    }

    // prevent admin from removing their own admin (optional but safer)
    if (req.user && req.user._id.toString() === id && isAdmin === false) {
      return res.status(400).json({ message: "You cannot remove your own admin role" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isAdmin = isAdmin;
    await user.save();

    const safeUser = await User.findById(id).select("-password");

    res.json({ message: "User role updated", user: safeUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user role", error: err.message });
  }
};
