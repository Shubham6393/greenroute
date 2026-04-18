/**
 * EmissionChart Component
 * Visual bar chart comparing CO2 emissions and eco scores across routes
 */

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const CHART_COLORS = ["#22c55e", "#eab308", "#f97316", "#8b5cf6"];

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={styles.tooltip}>
        <p style={styles.tooltipLabel}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color, fontSize: "13px", margin: "2px 0" }}>
            {entry.name}: <strong>{entry.value}</strong>
            {entry.name === "CO₂ (g)" ? "g" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const EmissionChart = ({ routes }) => {
  const [activeChart, setActiveChart] = useState("emissions"); // "emissions" | "scores"

  if (!routes || routes.length === 0) return null;

  // Prepare chart data
  const chartData = routes.map((route, i) => ({
    name: `Route ${i + 1}`,
    fullLabel: route.label,
    "CO₂ (g)": Math.round(route.co2Kg * 1000),
    "Eco Score": route.ecoScore,
    "Distance (km)": route.distanceKm,
    "Time (min)": route.durationMin,
    color: CHART_COLORS[i % CHART_COLORS.length],
    isEco: route.isEcoFriendly,
    isFast: route.isFastest,
  }));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📊 Route Comparison</h3>
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(activeChart === "emissions" ? styles.tabActive : {}) }}
            onClick={() => setActiveChart("emissions")}
          >
            💨 Emissions
          </button>
          <button
            style={{ ...styles.tab, ...(activeChart === "scores" ? styles.tabActive : {}) }}
            onClick={() => setActiveChart("scores")}
          >
            ⭐ Eco Scores
          </button>
          <button
            style={{ ...styles.tab, ...(activeChart === "distance" ? styles.tabActive : {}) }}
            onClick={() => setActiveChart("distance")}
          >
            📏 Distance
          </button>
        </div>
      </div>

      {/* Chart */}
      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            barSize={48}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#9ca3af", fontSize: 13, fontFamily: "'DM Sans'" }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 12, fontFamily: "'DM Sans'" }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />

            {activeChart === "emissions" && (
              <Bar dataKey="CO₂ (g)" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.isEco ? "#22c55e" : entry.color}
                    fillOpacity={entry.isEco ? 1 : 0.65}
                  />
                ))}
              </Bar>
            )}

            {activeChart === "scores" && (
              <Bar dataKey="Eco Score" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.isEco ? "#22c55e" : entry.color}
                    fillOpacity={entry.isEco ? 1 : 0.65}
                  />
                ))}
              </Bar>
            )}

            {activeChart === "distance" && (
              <Bar dataKey="Distance (km)" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} fillOpacity={0.75} />
                ))}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend / Summary */}
      <div style={styles.legend}>
        {routes.map((route, i) => (
          <div key={i} style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: CHART_COLORS[i % 4] }} />
            <div>
              <span style={styles.legendLabel}>{route.label}</span>
              {route.isEcoFriendly && <span style={styles.ecoBadge}> 🌿</span>}
              {route.isFastest && <span style={styles.fastBadge}> ⚡</span>}
              <br />
              <span style={styles.legendSub}>
                {Math.round(route.co2Kg * 1000)}g CO₂ · Score: {route.ecoScore}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(134,239,172,0.12)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "18px",
    fontWeight: "700",
    color: "#86efac",
  },
  tabs: {
    display: "flex",
    gap: "6px",
    background: "rgba(0,0,0,0.25)",
    borderRadius: "10px",
    padding: "4px",
  },
  tab: {
    background: "transparent",
    border: "none",
    color: "#6b7280",
    padding: "6px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    fontFamily: "'Syne', sans-serif",
    transition: "all 0.2s",
  },
  tabActive: {
    background: "rgba(134,239,172,0.15)",
    color: "#86efac",
  },
  chartWrapper: { marginBottom: "20px" },
  legend: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    paddingTop: "16px",
  },
  legendItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },
  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
    marginTop: "4px",
  },
  legendLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#e2e8f0",
    fontFamily: "'Syne', sans-serif",
  },
  legendSub: { fontSize: "11px", color: "#6b7280" },
  ecoBadge: { fontSize: "13px" },
  fastBadge: { fontSize: "13px" },
  tooltip: {
    background: "#0f1f14",
    border: "1px solid rgba(134,239,172,0.25)",
    borderRadius: "10px",
    padding: "12px 16px",
  },
  tooltipLabel: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "14px",
    fontWeight: "700",
    color: "#86efac",
    marginBottom: "6px",
  },
};

export default EmissionChart;
