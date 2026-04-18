/**
 * RouteCard Component
 * Displays details for a single route: distance, time, CO2, eco score
 */

import React from "react";

// Returns color based on eco score
const getScoreColor = (score) => {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#eab308";
  if (score >= 25) return "#f97316";
  return "#ef4444";
};

// Returns score label
const getScoreLabel = (score) => {
  if (score >= 75) return "Excellent";
  if (score >= 50) return "Good";
  if (score >= 25) return "Fair";
  return "Poor";
};

const vehicleIcons = {
  car: "🚗",
  bike: "🏍️",
  bus: "🚌",
  walking: "🚶",
};

const RouteCard = ({ route, rank }) => {
  const {
    label,
    distanceKm,
    durationMin,
    co2Kg,
    ecoScore,
    summary,
    isFastest,
    isEcoFriendly,
    vehicleType,
  } = route;

  const scoreColor = getScoreColor(ecoScore);
  const hours = Math.floor(durationMin / 60);
  const mins = durationMin % 60;
  const durationDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

  return (
    <div
      style={{
        ...styles.card,
        ...(isEcoFriendly ? styles.ecoCard : {}),
        ...(isFastest && !isEcoFriendly ? styles.fastCard : {}),
      }}
    >
      {/* Badges */}
      <div style={styles.badgeRow}>
        {isEcoFriendly && (
          <span style={{ ...styles.badge, ...styles.ecoBadge }}>
            🌿 Eco-Friendly
          </span>
        )}
        {isFastest && (
          <span style={{ ...styles.badge, ...styles.fastBadge }}>
            ⚡ Fastest
          </span>
        )}
        {!isEcoFriendly && !isFastest && (
          <span style={{ ...styles.badge, ...styles.altBadge }}>
            🔀 Alternative
          </span>
        )}
      </div>

      {/* Route Title */}
      <div style={styles.cardHeader}>
        <div>
          <h3 style={styles.cardTitle}>{label}</h3>
          <p style={styles.cardSummary}>{summary}</p>
        </div>
        {/* Eco Score Circle */}
        <div style={{ ...styles.scoreCircle, borderColor: scoreColor }}>
          <span style={{ ...styles.scoreNum, color: scoreColor }}>{ecoScore}</span>
          <span style={styles.scoreText}>Score</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.stat}>
          <span style={styles.statIcon}>📏</span>
          <div>
            <div style={styles.statValue}>{distanceKm} km</div>
            <div style={styles.statLabel}>Distance</div>
          </div>
        </div>

        <div style={styles.stat}>
          <span style={styles.statIcon}>⏱️</span>
          <div>
            <div style={styles.statValue}>{durationDisplay}</div>
            <div style={styles.statLabel}>Duration</div>
          </div>
        </div>

        <div style={styles.stat}>
          <span style={styles.statIcon}>💨</span>
          <div>
            <div style={{ ...styles.statValue, color: co2Kg === 0 ? "#22c55e" : "#fbbf24" }}>
              {co2Kg === 0 ? "0 g" : `${(co2Kg * 1000).toFixed(0)} g`}
            </div>
            <div style={styles.statLabel}>CO₂ Emitted</div>
          </div>
        </div>

        <div style={styles.stat}>
          <span style={styles.statIcon}>{vehicleIcons[vehicleType] || "🚗"}</span>
          <div>
            <div style={styles.statValue}>
              {vehicleType?.charAt(0).toUpperCase() + vehicleType?.slice(1)}
            </div>
            <div style={styles.statLabel}>Vehicle</div>
          </div>
        </div>
      </div>

      {/* Eco Score Bar */}
      <div style={styles.scoreBarContainer}>
        <div style={styles.scoreBarLabel}>
          <span>Eco Rating: <strong style={{ color: scoreColor }}>{getScoreLabel(ecoScore)}</strong></span>
          <span style={{ color: scoreColor }}>{ecoScore}/100</span>
        </div>
        <div style={styles.scoreBarTrack}>
          <div
            style={{
              ...styles.scoreBarFill,
              width: `${ecoScore}%`,
              background: scoreColor,
            }}
          />
        </div>
      </div>

      {/* CO2 Equivalent Note */}
      {co2Kg > 0 && (
        <p style={styles.co2Note}>
          ≈ {(co2Kg * 1000).toFixed(0)}g CO₂ — equivalent to charging{" "}
          {Math.round((co2Kg * 1000) / 8.22)} smartphones 📱
        </p>
      )}
      {co2Kg === 0 && (
        <p style={{ ...styles.co2Note, color: "#22c55e" }}>
          🌱 Zero emissions! The cleanest option possible.
        </p>
      )}
    </div>
  );
};

const styles = {
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(134,239,172,0.12)",
    borderRadius: "16px",
    padding: "24px",
    transition: "all 0.3s",
    animation: "fadeIn 0.5s ease forwards",
  },
  ecoCard: {
    background: "rgba(22,163,74,0.08)",
    border: "1px solid rgba(34,197,94,0.4)",
    boxShadow: "0 0 24px rgba(34,197,94,0.12)",
  },
  fastCard: {
    background: "rgba(234,179,8,0.06)",
    border: "1px solid rgba(234,179,8,0.3)",
  },
  badgeRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
  },
  badge: {
    fontSize: "11px",
    fontWeight: "700",
    fontFamily: "'Syne', sans-serif",
    padding: "4px 12px",
    borderRadius: "20px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  ecoBadge: {
    background: "rgba(34,197,94,0.15)",
    color: "#22c55e",
    border: "1px solid rgba(34,197,94,0.3)",
  },
  fastBadge: {
    background: "rgba(234,179,8,0.15)",
    color: "#eab308",
    border: "1px solid rgba(234,179,8,0.3)",
  },
  altBadge: {
    background: "rgba(148,163,184,0.1)",
    color: "#94a3b8",
    border: "1px solid rgba(148,163,184,0.2)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "18px",
    fontWeight: "700",
    color: "#e8f5e2",
    marginBottom: "4px",
  },
  cardSummary: {
    fontSize: "13px",
    color: "#6b7280",
    maxWidth: "240px",
    lineHeight: "1.4",
  },
  scoreCircle: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    border: "3px solid",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    background: "rgba(0,0,0,0.2)",
  },
  scoreNum: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "22px",
    fontWeight: "800",
    lineHeight: 1,
  },
  scoreText: {
    fontSize: "10px",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    marginBottom: "20px",
  },
  stat: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(0,0,0,0.2)",
    borderRadius: "12px",
    padding: "12px 14px",
  },
  statIcon: { fontSize: "22px" },
  statValue: {
    fontSize: "18px",
    fontWeight: "700",
    fontFamily: "'Syne', sans-serif",
    color: "#e8f5e2",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: "11px",
    color: "#6b7280",
    marginTop: "3px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  scoreBarContainer: { marginBottom: "14px" },
  scoreBarLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#9ca3af",
    marginBottom: "8px",
  },
  scoreBarTrack: {
    height: "8px",
    background: "rgba(255,255,255,0.07)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 1s ease",
  },
  co2Note: {
    fontSize: "12px",
    color: "#6b7280",
    fontStyle: "italic",
    marginTop: "8px",
  },
};

export default RouteCard;
