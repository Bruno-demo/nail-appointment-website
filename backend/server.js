// 1️⃣ IMPORTS (TOP OF FILE)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const authMiddleware = require("./middleware/authMiddleware");

// 2️⃣ APP INIT
const app = express();

const configuredOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const corsOrigins = [
  ...configuredOrigins,
  "https://nail-appointment-website.vercel.app",
  "https://nail-appointment-website.onrender.com",
  "https://nail-appointment-website-backend.onrender.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

const uploadsDir = process.env.UPLOADS_DIR
  ? path.resolve(process.cwd(), process.env.UPLOADS_DIR)
  : path.resolve(__dirname, "uploads");

// 3️⃣ MIDDLEWARE (THIS IS WHERE CORS GOES)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, "");

    if (corsOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
  credentials: true,
  optionsSuccessStatus: 200
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





