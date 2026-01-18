const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware"); // JWT protection
const { updateProfile } = require("../controllers/authController");
const { getMe } = require("../controllers/userController");
 // uses your existing controller
// users.js
// Admin users routes + user profile route if you want later.
// NOTE: authMiddleware must run before admin.

const adminMiddleware = require("../middleware/admin");

const { getAllUsers, setUserAdmin } = require("../controllers/adminUsersController");

// ✅ Admin: get all users
router.get("/", authMiddleware, adminMiddleware, getAllUsers);

// ✅ Admin: set/unset admin
router.put("/:id/admin", authMiddleware, adminMiddleware, setUserAdmin);

module.exports = router;


/*
  PUT /api/users/me
  Protected route: user must be logged in
*/
router.put("/me", authMiddleware, updateProfile);

router.get("/me", authMiddleware, getMe);

module.exports = router;
