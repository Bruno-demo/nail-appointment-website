// admin.js
// Admin-only middleware. Requires authMiddleware to run first.

const admin = (req, res, next) => {
  // authMiddleware puts the full user object into req.user
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = admin;
