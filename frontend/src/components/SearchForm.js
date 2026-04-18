/**
 * SearchForm Component
 * Input form for source, destination, and vehicle type
 */

import React, { useState } from "react";

// Vehicle options with icons and labels
const VEHICLES = [
  { value: "car",     label: "Car",      icon: "🚗", desc: "0.192 kg CO₂/km" },
  { value: "bike",    label: "Bike",     icon: "🏍️", desc: "0.103 kg CO₂/km" },
  { value: "bus",     label: "Bus",      icon: "🚌", desc: "0.105 kg CO₂/km" },
  { value: "walking", label: "Walking",  icon: "🚶", desc: "0 kg CO₂/km" },
];

const SearchForm = ({ onSearch, loading }) => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("car");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim()) return;
    onSearch(source.trim(), destination.trim(), vehicleType);
  };

  const swapLocations = () => {
    setSource(destination);
    setDestination(source);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formTitle}>
        <span style={styles.leaf}>🌿</span>
        <h2 style={styles.formHeading}>Plan Your Green Journey</h2>
      </div>

      {/* Location Inputs */}
      <div style={styles.locationRow}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>📍 From</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter starting point..."
            style={styles.input}
            required
          />
        </div>

        <button
          type="button"
          onClick={swapLocations}
          style={styles.swapBtn}
          title="Swap locations"
        >
          ⇅
        </button>

        <div style={styles.inputGroup}>
          <label style={styles.label}>🏁 To</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination..."
            style={styles.input}
            required
          />
        </div>
      </div>

      {/* Vehicle Selector */}
      <div style={styles.vehicleSection}>
        <label style={styles.label}>🚦 Travel Mode</label>
        <div style={styles.vehicleGrid}>
          {VEHICLES.map((v) => (
            <button
              key={v.value}
              type="button"
              onClick={() => setVehicleType(v.value)}
              style={{
                ...styles.vehicleBtn,
                ...(vehicleType === v.value ? styles.vehicleBtnActive : {}),
              }}
            >
              <span style={styles.vehicleIcon}>{v.icon}</span>
              <span style={styles.vehicleLabel}>{v.label}</span>
              <span style={styles.vehicleDesc}>{v.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !source || !destination}
        style={{
          ...styles.submitBtn,
          ...(loading || !source || !destination ? styles.submitBtnDisabled : {}),
        }}
      >
        {loading ? (
          <>⏳ Calculating Routes...</>
        ) : (
          <>🌍 Find Eco Routes</>
        )}
      </button>
    </form>
  );
};

const styles = {
  form: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(134,239,172,0.15)",
    borderRadius: "20px",
    padding: "32px",
    marginBottom: "32px",
    backdropFilter: "blur(10px)",
  },
  formTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "28px",
  },
  leaf: { fontSize: "28px" },
  formHeading: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "22px",
    fontWeight: "700",
    color: "#86efac",
    letterSpacing: "-0.5px",
  },
  locationRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  inputGroup: {
    flex: 1,
    minWidth: "200px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#86efac",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  input: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(134,239,172,0.25)",
    borderRadius: "12px",
    padding: "14px 16px",
    color: "#e8f5e2",
    fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
  },
  swapBtn: {
    background: "rgba(134,239,172,0.1)",
    border: "1px solid rgba(134,239,172,0.3)",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    color: "#86efac",
    fontSize: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "2px",
    transition: "all 0.2s",
    flexShrink: 0,
  },
  vehicleSection: {
    marginBottom: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  vehicleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
  },
  vehicleBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(134,239,172,0.15)",
    borderRadius: "12px",
    padding: "14px 8px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    transition: "all 0.2s",
    color: "#a0aec0",
  },
  vehicleBtnActive: {
    background: "rgba(134,239,172,0.12)",
    border: "1px solid #86efac",
    color: "#e8f5e2",
    boxShadow: "0 0 16px rgba(134,239,172,0.2)",
  },
  vehicleIcon: { fontSize: "22px" },
  vehicleLabel: {
    fontSize: "13px",
    fontWeight: "600",
    fontFamily: "'Syne', sans-serif",
  },
  vehicleDesc: { fontSize: "10px", color: "#6b7280", textAlign: "center" },
  submitBtn: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    border: "none",
    borderRadius: "14px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "700",
    fontFamily: "'Syne', sans-serif",
    cursor: "pointer",
    letterSpacing: "0.5px",
    transition: "all 0.2s",
    boxShadow: "0 4px 20px rgba(22,163,74,0.35)",
  },
  submitBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    boxShadow: "none",
  },
};

export default SearchForm;
