// 1️⃣ IMPORTS (TOP OF FILE)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authMiddleware = require("./middleware/authMiddleware");

// 2️⃣ APP INIT
const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "https://nail-appointment-website-frontend.onrender.com")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);
const uploadsDir = process.env.UPLOADS_DIR || "uploads";

// 3️⃣ MIDDLEWARE (THIS IS WHERE CORS GOES)

// Allow frontend (React on port) to access backend
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    const normalizedOrigin = origin.replace(/\/$/, "");
    if (corsOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Parse JSON body
app.use(express.json());

// Protect API routes by default (allowlist public endpoints)
app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    return next();
  }

  if (req.method === "OPTIONS") {
    return next();
  }

  if (req.path.startsWith("/api/auth")) {
    return next();
  }

  if (req.method === "GET" && req.path === "/api/services") {
    return next();
  }

  return authMiddleware(req, res, next);
});

// 4️⃣ ROUTES
const authRoutes = require("./routes/auth");
const serviceRoutes = require("./routes/service");
const appointmentRoutes = require("./routes/appointment");
const paymentRoutes = require("./routes/payment");
const userRoutes = require("./routes/user");


app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);

app.use("/uploads", express.static(uploadsDir));

// 5️⃣ DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// 6️⃣ SERVER LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





