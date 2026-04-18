/**
 * LoadingSpinner Component
 */
import React from "react";

const LoadingSpinner = ({ message = "Calculating eco routes..." }) => (
  <div style={styles.wrapper}>
    <div style={styles.spinner} />
    <p style={styles.message}>{message}</p>
    <p style={styles.subMessage}>Analyzing carbon footprint for each route 🌍</p>
  </div>
);

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 24px",
    gap: "16px",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid rgba(134,239,172,0.15)",
    borderTop: "4px solid #22c55e",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  message: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "18px",
    fontWeight: "700",
    color: "#86efac",
  },
  subMessage: {
    fontSize: "14px",
    color: "#6b7280",
  },
};

export default LoadingSpinner;
