// controllers/userController.js
exports.getMe = async (req, res) => {
  res.json(req.user); // authMiddleware already attaches req.user
};