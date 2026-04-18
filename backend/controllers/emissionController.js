/**
 * Emission Controller
 * Standalone CO2 calculation endpoint
 * Useful for frontend to calculate emissions without full route fetch
 */

const { calculateCO2, calculateEcoScore, EMISSION_FACTORS } = require("./emissionService");

/**
 * POST /api/calculate-emission
 * Body: { distanceKm, vehicleType, durationMin }
 */
const calculateEmission = (req, res) => {
  const { distanceKm, vehicleType, durationMin } = req.body;

  // Validate inputs
  if (!distanceKm || !vehicleType) {
    return res.status(400).json({ error: "distanceKm and vehicleType are required" });
  }

  const validVehicles = Object.keys(EMISSION_FACTORS);
  if (!validVehicles.includes(vehicleType)) {
    return res.status(400).json({
      error: `vehicleType must be one of: ${validVehicles.join(", ")}`,
    });
  }

  if (isNaN(distanceKm) || distanceKm <= 0) {
    return res.status(400).json({ error: "distanceKm must be a positive number" });
  }

  const co2Kg = calculateCO2(parseFloat(distanceKm), vehicleType);
  const factor = EMISSION_FACTORS[vehicleType];

  // For comparison, calculate all vehicle types
  const comparison = validVehicles.map((v) => ({
    vehicle: v,
    co2Kg: calculateCO2(parseFloat(distanceKm), v),
    emissionFactor: EMISSION_FACTORS[v],
    label: v.charAt(0).toUpperCase() + v.slice(1),
  }));

  return res.json({
    success: true,
    result: {
      distanceKm: parseFloat(distanceKm),
      vehicleType,
      co2Kg,
      emissionFactor: factor,
      durationMin: durationMin || null,
    },
    comparison,
    tip:
      co2Kg === 0
        ? "Zero emissions! You're choosing the greenest option 🌱"
        : co2Kg < 1
        ? "Low emissions journey! Great choice 🌿"
        : co2Kg < 5
        ? "Moderate emissions. Consider public transport for greener travel ♻️"
        : "High emissions. Consider switching to bus, bike, or walking! 🚶",
  });
};

module.exports = { calculateEmission };
