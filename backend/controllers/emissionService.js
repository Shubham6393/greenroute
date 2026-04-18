/**
 * Emission Calculation Service
 * Core business logic for CO2 calculations and Eco Scoring
 */

// ─── Emission Factors (kg CO2 per km) ─────────────────────────────────────────
const EMISSION_FACTORS = {
  car: 0.192,       // Average petrol car
  bike: 0.103,      // Motorbike/scooter
  bus: 0.105,       // Public bus (per passenger)
  walking: 0,       // Zero emissions
};

// ─── Average Speed (km/h) for dummy data generation ───────────────────────────
const AVG_SPEED = {
  car: 50,
  bike: 40,
  bus: 30,
  walking: 5,
};

/**
 * Calculate CO2 emission for a given distance and vehicle
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} vehicleType - One of: car, bike, bus, walking
 * @returns {number} CO2 in kilograms (rounded to 3 decimal places)
 */
const calculateCO2 = (distanceKm, vehicleType) => {
  const factor = EMISSION_FACTORS[vehicleType] ?? 0;
  return parseFloat((distanceKm * factor).toFixed(3));
};

/**
 * Calculate Eco Score (0–100) for a route
 * Lower emissions = higher score
 * Penalizes very long duration slightly
 *
 * Formula:
 *   emissionScore = (1 - co2 / maxCo2) * 70     → up to 70 pts for low emission
 *   timeScore     = (1 - duration / maxDuration) * 30  → up to 30 pts for speed
 *   ecoScore      = emissionScore + timeScore
 *
 * @param {number} co2Kg - CO2 in kg
 * @param {number} durationMin - Duration in minutes
 * @param {number} maxCo2 - Max CO2 across all routes (for normalization)
 * @param {number} maxDuration - Max duration across all routes
 * @returns {number} Score from 0 to 100
 */
const calculateEcoScore = (co2Kg, durationMin, maxCo2, maxDuration) => {
  // Avoid division by zero
  const emissionScore = maxCo2 > 0
    ? (1 - co2Kg / maxCo2) * 70
    : 70;

  const timeScore = maxDuration > 0
    ? (1 - durationMin / maxDuration) * 30
    : 30;

  return Math.round(emissionScore + timeScore);
};

/**
 * Generate realistic dummy route data when Google Maps API is unavailable
 * Creates 2 route variants with slight distance/time differences
 */
const generateDummyRoutes = (source, destination, vehicleType) => {
  // Seed a pseudo-distance based on string lengths for consistency
  const seed = (source.length + destination.length) * 3.7;
  const baseDistance = Math.max(5, Math.min(seed, 80)); // 5–80 km range

  const routes = [
    {
      // Route 1: Faster but longer distance (e.g., highway)
      label: "Route via Highway",
      distanceKm: parseFloat((baseDistance * 1.1).toFixed(2)),
      durationMin: Math.round((baseDistance * 1.1) / AVG_SPEED[vehicleType] * 60),
      summary: `${source} → Highway → ${destination}`,
    },
    {
      // Route 2: Slightly shorter but through local roads
      label: "Route via City Roads",
      distanceKm: parseFloat(baseDistance.toFixed(2)),
      durationMin: Math.round((baseDistance / AVG_SPEED[vehicleType]) * 60 * 1.3), // more stops
      summary: `${source} → City Center → ${destination}`,
    },
    {
      // Route 3: Scenic/alternate
      label: "Alternate Route",
      distanceKm: parseFloat((baseDistance * 1.25).toFixed(2)),
      durationMin: Math.round((baseDistance * 1.25) / AVG_SPEED[vehicleType] * 60 * 0.95),
      summary: `${source} → Ring Road → ${destination}`,
    },
  ];

  return routes;
};

/**
 * Process raw routes: attach CO2 and EcoScore to each
 * Also tag the "fastest" and "eco-friendly" route
 */
const processRoutes = (rawRoutes, vehicleType) => {
  // Step 1: Calculate CO2 for each
  const withEmissions = rawRoutes.map((r) => ({
    ...r,
    co2Kg: calculateCO2(r.distanceKm, vehicleType),
  }));

  // Step 2: Find max values for normalization
  const maxCo2 = Math.max(...withEmissions.map((r) => r.co2Kg));
  const maxDuration = Math.max(...withEmissions.map((r) => r.durationMin));

  // Step 3: Add Eco Score
  const withScores = withEmissions.map((r) => ({
    ...r,
    ecoScore: calculateEcoScore(r.co2Kg, r.durationMin, maxCo2, maxDuration),
  }));

  // Step 4: Tag fastest (min duration) and eco-friendly (max ecoScore)
  const fastestIdx = withScores.reduce(
    (minIdx, r, i, arr) => (r.durationMin < arr[minIdx].durationMin ? i : minIdx),
    0
  );
  const ecoIdx = withScores.reduce(
    (maxIdx, r, i, arr) => (r.ecoScore > arr[maxIdx].ecoScore ? i : maxIdx),
    0
  );

  return withScores.map((r, i) => ({
    ...r,
    isFastest: i === fastestIdx,
    isEcoFriendly: i === ecoIdx,
    emissionFactor: EMISSION_FACTORS[vehicleType],
    vehicleType,
  }));
};

module.exports = {
  calculateCO2,
  calculateEcoScore,
  generateDummyRoutes,
  processRoutes,
  EMISSION_FACTORS,
};
