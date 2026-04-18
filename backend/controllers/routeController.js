/**
 * Route Controller
 * Fetches routes from Google Maps API (or dummy data)
 * and returns processed route information
 */

const axios = require("axios");
const RouteSearch = require("../models/RouteSearch");
const {
  generateDummyRoutes,
  processRoutes,
} = require("./emissionService");

/**
 * Fetch real routes from Google Maps Directions API
 */
const fetchGoogleRoutes = async (source, destination, vehicleType) => {
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  // Map our vehicle types to Google Maps travel modes
  const travelModeMap = {
    car: "driving",
    bike: "driving",    // motorcycles use driving mode
    bus: "transit",
    walking: "walking",
  };

  const mode = travelModeMap[vehicleType] || "driving";

  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/directions/json",
    {
      params: {
        origin: source,
        destination: destination,
        mode: mode,
        alternatives: true,   // Request alternative routes
        key: API_KEY,
      },
      timeout: 8000,
    }
  );

  const data = response.data;

  if (data.status !== "OK" || !data.routes?.length) {
    throw new Error(`Google Maps API returned: ${data.status}`);
  }

  // Parse Google's response into our standard format
  return data.routes.map((route, idx) => {
    const leg = route.legs[0];
    const distanceKm = leg.distance.value / 1000; // meters → km
    const durationMin = Math.round(leg.duration.value / 60); // seconds → min

    return {
      label: `Route ${idx + 1}`,
      distanceKm: parseFloat(distanceKm.toFixed(2)),
      durationMin,
      summary: route.summary || `Route ${idx + 1}`,
      // Include polyline for optional map rendering
      polyline: route.overview_polyline?.points,
      startAddress: leg.start_address,
      endAddress: leg.end_address,
    };
  });
};

/**
 * POST /api/route
 * Main endpoint to get route recommendations
 */
const getRoutes = async (req, res) => {
  const { source, destination, vehicleType } = req.body;

  // Input validation
  if (!source || !destination || !vehicleType) {
    return res.status(400).json({
      error: "Missing required fields: source, destination, vehicleType",
    });
  }

  const validVehicles = ["car", "bike", "bus", "walking"];
  if (!validVehicles.includes(vehicleType)) {
    return res.status(400).json({
      error: `vehicleType must be one of: ${validVehicles.join(", ")}`,
    });
  }

  try {
    let rawRoutes;
    let dataSource = "live"; // Track whether we used real or dummy data

    const useDummy =
      process.env.USE_DUMMY_DATA === "true" ||
      !process.env.GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY === "your_google_maps_api_key_here";

    if (useDummy) {
      // Use dummy data (demo mode)
      console.log("📍 Using dummy route data (set USE_DUMMY_DATA=false to use Google API)");
      rawRoutes = generateDummyRoutes(source, destination, vehicleType);
      dataSource = "dummy";
    } else {
      // Try Google Maps API
      try {
        rawRoutes = await fetchGoogleRoutes(source, destination, vehicleType);
        console.log(`✅ Fetched ${rawRoutes.length} routes from Google Maps`);
      } catch (apiErr) {
        console.warn("⚠️  Google API failed, using dummy data:", apiErr.message);
        rawRoutes = generateDummyRoutes(source, destination, vehicleType);
        dataSource = "dummy_fallback";
      }
    }

    // Process routes: add CO2, EcoScore, tags
    const processedRoutes = processRoutes(rawRoutes, vehicleType);

    // Save to MongoDB (non-blocking, don't fail if DB is down)
    try {
      await RouteSearch.create({
        source,
        destination,
        vehicleType,
        routes: processedRoutes.map((r) => ({
          label: r.label,
          distanceKm: r.distanceKm,
          durationMin: r.durationMin,
          co2Kg: r.co2Kg,
          ecoScore: r.ecoScore,
          summary: r.summary,
        })),
      });
    } catch (dbErr) {
      console.warn("DB save skipped:", dbErr.message);
    }

    return res.json({
      success: true,
      dataSource,
      query: { source, destination, vehicleType },
      routes: processedRoutes,
      meta: {
        totalRoutes: processedRoutes.length,
        fastestRoute: processedRoutes.find((r) => r.isFastest)?.label,
        ecoRoute: processedRoutes.find((r) => r.isEcoFriendly)?.label,
      },
    });
  } catch (err) {
    console.error("Route fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch routes", details: err.message });
  }
};

module.exports = { getRoutes };
