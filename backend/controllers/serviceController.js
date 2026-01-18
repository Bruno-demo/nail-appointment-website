const Service = require("../models/Service");

/**
 * @desc   Get all services (public)
 * @route  GET /api/services
 * @access Public
 */
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc   Add a service (admin only)
 * @route  POST /api/services
 * @access Admin
 */
exports.createService = async (req, res) => {
  try {
    const { name, price, duration, bookingFee } = req.body;

    // image comes from multer
    if (!req.file) {
      return res.status(400).json({ message: "Service image is required" });
    }

        if (!name || price == null || duration == null || bookingFee == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const service = new Service({
      name,
      price,
      duration,
      bookingFee,
      image: req.file.filename // saved file name
    });

    await service.save();

    res.status(201).json({ message: "Service created successfully", service });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc   Update a service (admin only)
 * @route  PUT /api/services/:id
 * @access Admin
 */
exports.updateService = async (req, res) => {
  try {
    const { name, price, duration, bookingFee } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (name) service.name = name;
    if (price) service.price = price;
    if (duration) service.duration = duration;
    if (bookingFee) service.bookingFee = bookingFee;

    // If new image uploaded
    if (req.file) {
      service.image = req.file.filename;
    }

    await service.save();

    res.json({ message: "Service updated successfully", service });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc   Delete a service (admin only)
 * @route  DELETE /api/services/:id
 * @access Admin
 */
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    await service.deleteOne();
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
