/**
 * RouteSearch Model
 * Stores each route search query for analytics/history
 */

const mongoose = require("mongoose");

const routeSearchSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      enum: ["car", "bike", "bus", "walking"],
      required: true,
    },
    routes: [
      {
        label: String,         // "Fastest" or "Eco-Friendly"
        distanceKm: Number,
        durationMin: Number,
        co2Kg: Number,
        ecoScore: Number,
        summary: String,
      },
    ],
    searchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RouteSearch", routeSearchSchema);
