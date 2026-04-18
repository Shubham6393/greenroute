/**
 * useRoutes Hook
 * Manages route fetching state: loading, error, data
 */

import { useState, useCallback } from "react";
import { fetchRoutes } from "../services/api";

const useRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  const [query, setQuery] = useState(null);

  const searchRoutes = useCallback(async (source, destination, vehicleType) => {
    setLoading(true);
    setError(null);
    setRoutes([]);
    setMeta(null);

    try {
      const data = await fetchRoutes(source, destination, vehicleType);
      setRoutes(data.routes || []);
      setMeta(data.meta || {});
      setQuery(data.query || {});
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch routes. Is the backend running?";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setRoutes([]);
    setError(null);
    setMeta(null);
    setQuery(null);
  }, []);

  return { routes, loading, error, meta, query, searchRoutes, clearResults };
};

export default useRoutes;
