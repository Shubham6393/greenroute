/**
 * GreenRoute Backend Server
 * Carbon-Aware Sustainable Travel Recommendation System
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const routeRoutes = require("./routes/routeRoutes");
const emissionRoutes = require("./routes/emissionRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" })); // Allow all origins for dev
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Request Logger ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/route", routeRoutes);
app.use("/api/calculate-emission", emissionRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "GreenRoute API is running 🌿" });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

// ─── MongoDB Connection ───────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/greenroute");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.warn("⚠️  MongoDB not connected. Running without DB persistence.");
  }

  app.listen(PORT, () => {
    console.log(`\n🌿 GreenRoute Server running at http://localhost:${PORT}`);
    console.log(`📡 API Endpoints:`);
    console.log(`   POST /api/route`);
    console.log(`   POST /api/calculate-emission`);
    console.log(`   GET  /health\n`);
  });
};

startServer();
