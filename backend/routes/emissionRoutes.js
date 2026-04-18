/**
 * Emission API Routes
 * POST /api/calculate-emission
 */

const express = require("express");
const router = express.Router();
const { calculateEmission } = require("../controllers/emissionController");

// POST /api/calculate-emission
// Body: { distanceKm: number, vehicleType: string, durationMin?: number }
router.post("/", calculateEmission);

module.exports = router;
