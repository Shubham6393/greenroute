/**
 * API Service
 * Centralizes all backend API calls
 */

import axios from "axios";

// Base URL from .env or fallback to localhost
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

/**
 * Fetch routes for a given source, destination, and vehicle type
 * @param {string} source
 * @param {string} destination
 * @param {string} vehicleType - car | bike | bus | walking
 */
export const fetchRoutes = async (source, destination, vehicleType) => {
  const response = await api.post("/route", { source, destination, vehicleType });
  return response.data;
};

/**
 * Calculate emission for a specific distance + vehicle
 * @param {number} distanceKm
 * @param {string} vehicleType
 * @param {number} durationMin
 */
export const calculateEmission = async (distanceKm, vehicleType, durationMin) => {
  const response = await api.post("/calculate-emission", {
    distanceKm,
    vehicleType,
    durationMin,
  });
  return response.data;
};

export default api;
