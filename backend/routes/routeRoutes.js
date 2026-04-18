/**
 * Route API Routes
 * POST /api/route
 */

const express = require("express");
const router = express.Router();
const { getRoutes } = require("../controllers/routeController");

// POST /api/route
// Body: { source: string, destination: string, vehicleType: string }
router.post("/", getRoutes);

module.exports = router;
