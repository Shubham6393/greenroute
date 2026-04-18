import axios from "axios";

const API_BASE = "https://greenroute-rcgn.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export const fetchRoutes = async (source, destination, vehicleType) => {
  return await api.post("/route", {
    source,
    destination,
    vehicleType,
  });
};

export const calculateEmission = async (distanceKm, vehicleType, durationMin) => {
  return await api.post("/calculate-emission", {
    distanceKm,
    vehicleType,
    durationMin,
  });
};