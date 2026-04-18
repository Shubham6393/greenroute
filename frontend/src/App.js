/**
 * GreenRoute - App.js
 * Root component: ties together search, results, chart, and layout
 */

import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
import RouteCard from "./components/RouteCard";
import EmissionChart from "./components/EmissionChart";
import LoadingSpinner from "./components/LoadingSpinner";
import useRoutes from "./hooks/useRoutes";

const App = () => {
  const { routes, loading, error, meta, query, searchRoutes } = useRoutes();
  const [searched, setSearched] = useState(false);

  const handleSearch = async (source, destination, vehicleType) => {
    setSearched(true);
    await searchRoutes(source, destination, vehicleType);
  };

  return (
    <div style={styles.root}>
      {/* Ambient background orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.orb3} />

      {/* Noise texture overlay */}
      <div style={styles.noiseOverlay} />

      <div style={styles.container}>
        {/* ── Header ──────────────────────────────────────── */}
        <header style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIconWrap}>
              <span style={styles.logoIcon}>🌿</span>
            </div>
            <div>
              <h1 style={styles.logoText}>GreenRoute</h1>
              <p style={styles.logoSub}>Carbon-Aware Travel Planner</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <span style={styles.tagBadge}>🌍 Eco Intelligence</span>
            <span style={styles.versionBadge}>v1.0</span>
          </div>
        </header>

        {/* ── Hero tagline (only on empty state) ──────────── */}
        {!searched && (
          <div style={styles.hero}>
            <h2 style={styles.heroTitle}>
              Travel smarter.<br />
              <span style={styles.heroAccent}>Pollute less.</span>
            </h2>
            <p style={styles.heroSub}>
              Compare routes by carbon footprint, not just distance.
              Choose the path that's good for you — and the planet.
            </p>
          </div>
        )}

        {/* ── Search Form ──────────────────────────────────── */}
        <SearchForm onSearch={handleSearch} loading={loading} />

        {/* ── Loading ──────────────────────────────────────── */}
        {loading && <LoadingSpinner />}

        {/* ── Error ────────────────────────────────────────── */}
        {error && !loading && (
          <div style={styles.errorBox}>
            <div style={styles.errorIcon}>⚠️</div>
            <div>
              <p style={styles.errorMsg}>{error}</p>
              <p style={styles.errorHint}>
                Make sure the backend is running:{" "}
                <code style={styles.code}>cd backend && npm run dev</code>
              </p>
            </div>
          </div>
        )}

        {/* ── Results ──────────────────────────────────────── */}
        {!loading && routes.length > 0 && (
          <div style={styles.results}>
            {/* Results summary banner */}
            <div style={styles.resultsBanner}>
              <div style={styles.bannerLeft}>
                <span style={styles.bannerDot} />
                <span>
                  Found <strong style={{ color: "#86efac" }}>{routes.length} routes</strong>{" "}
                  from <em style={{ color: "#d1fae5" }}>{query?.source}</em> to{" "}
                  <em style={{ color: "#d1fae5" }}>{query?.destination}</em>
                </span>
              </div>
              <div style={styles.bannerBadges}>
                {meta?.ecoRoute && (
                  <span style={styles.ecoWinBadge}>
                    🏆 Eco Winner: {meta.ecoRoute}
                  </span>
                )}
                {meta?.fastestRoute && meta.fastestRoute !== meta.ecoRoute && (
                  <span style={styles.fastWinBadge}>
                    ⚡ Fastest: {meta.fastestRoute}
                  </span>
                )}
              </div>
            </div>

            {/* Emission Comparison Chart */}
            <EmissionChart routes={routes} />

            {/* Route Cards */}
            <div style={styles.cardsSection}>
              <h3 style={styles.sectionTitle}>📋 Route Details</h3>
              <div style={styles.cardsGrid}>
                {routes.map((route, i) => (
                  <RouteCard key={i} route={route} rank={i + 1} />
                ))}
              </div>
            </div>

            {/* Eco Tips */}
            <EcoTip routes={routes} vehicleType={query?.vehicleType} />
          </div>
        )}

        {/* ── Empty State ──────────────────────────────────── */}
        {!loading && !error && !searched && (
          <EmptyState />
        )}

        {/* ── Footer ───────────────────────────────────────── */}
        <footer style={styles.footer}>
          <span>GreenRoute © 2025</span>
          <span style={styles.footerDivider}>·</span>
          <span>Built for a sustainable future 🌱</span>
          <span style={styles.footerDivider}>·</span>
          <span style={{ color: "#374151" }}>Powered by React + Express</span>
        </footer>
      </div>

      {/* Global keyframe animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        input:focus {
          border-color: #22c55e !important;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.15) !important;
          outline: none;
        }
        button:hover { filter: brightness(1.08); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a1f10; }
        ::-webkit-scrollbar-thumb { background: #1a3d22; border-radius: 3px; }
      `}</style>
    </div>
  );
};

/* ─── Eco Tip Component ──────────────────────────────────────────────────────── */
const EcoTip = ({ routes, vehicleType }) => {
  const ecoRoute = routes.find((r) => r.isEcoFriendly);
  const fastRoute = routes.find((r) => r.isFastest);

  if (!ecoRoute || !fastRoute) return null;

  const co2Saved = fastRoute.co2Kg - ecoRoute.co2Kg;
  const timeDiff = ecoRoute.durationMin - fastRoute.durationMin;

  const tips = {
    car: "🚗 Consider carpooling or switching to an EV to cut emissions by up to 70%.",
    bike: "🏍️ Motorbikes are better than cars but electric bikes are even greener!",
    bus: "🚌 Buses are one of the most eco-friendly motorised options — great choice!",
    walking: "🚶 Zero emissions! Walking is the ultimate green travel mode.",
  };

  return (
    <div style={tipStyles.box}>
      <h4 style={tipStyles.title}>💡 Eco Insight</h4>
      <div style={tipStyles.grid}>
        {co2Saved > 0 ? (
          <div style={tipStyles.card}>
            <span style={tipStyles.cardIcon}>🌱</span>
            <div>
              <p style={tipStyles.cardValue}>{(co2Saved * 1000).toFixed(0)}g CO₂</p>
              <p style={tipStyles.cardLabel}>Saved by choosing the eco route</p>
            </div>
          </div>
        ) : (
          <div style={tipStyles.card}>
            <span style={tipStyles.cardIcon}>🏆</span>
            <div>
              <p style={tipStyles.cardValue}>Best of both!</p>
              <p style={tipStyles.cardLabel}>The eco route is also the fastest</p>
            </div>
          </div>
        )}
        {timeDiff > 0 && (
          <div style={tipStyles.card}>
            <span style={tipStyles.cardIcon}>⏱️</span>
            <div>
              <p style={tipStyles.cardValue}>{timeDiff} min extra</p>
              <p style={tipStyles.cardLabel}>Small time cost for a greener trip</p>
            </div>
          </div>
        )}
        <div style={{ ...tipStyles.card, gridColumn: "span 2" }}>
          <span style={tipStyles.cardIcon}>🔍</span>
          <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: "1.5" }}>
            {tips[vehicleType] || tips.car}
          </p>
        </div>
      </div>
    </div>
  );
};

const tipStyles = {
  box: {
    background: "rgba(34,197,94,0.05)",
    border: "1px solid rgba(34,197,94,0.15)",
    borderRadius: "16px",
    padding: "24px",
    marginTop: "24px",
    animation: "fadeInUp 0.5s ease forwards",
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "16px",
    fontWeight: "700",
    color: "#86efac",
    marginBottom: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  card: {
    background: "rgba(0,0,0,0.2)",
    borderRadius: "12px",
    padding: "14px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  cardIcon: { fontSize: "24px", flexShrink: 0 },
  cardValue: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "16px",
    fontWeight: "700",
    color: "#22c55e",
    marginBottom: "2px",
  },
  cardLabel: { fontSize: "12px", color: "#6b7280" },
};

/* ─── Empty State Component ──────────────────────────────────────────────────── */
const EmptyState = () => (
  <div style={emptyStyles.wrap}>
    <div style={emptyStyles.iconRing}>
      <span style={emptyStyles.icon}>🗺️</span>
    </div>
    <h3 style={emptyStyles.title}>Plan Your Eco Journey</h3>
    <p style={emptyStyles.text}>
      Enter source and destination above to compare routes by their carbon footprint.
      We'll highlight the greenest path and give each route an Eco Score.
    </p>

    {/* Emission factor reference cards */}
    <div style={emptyStyles.factorGrid}>
      {[
        { icon: "🚗", label: "Car",     factor: "0.192", color: "#ef4444" },
        { icon: "🏍️", label: "Bike",    factor: "0.103", color: "#f97316" },
        { icon: "🚌", label: "Bus",     factor: "0.105", color: "#eab308" },
        { icon: "🚶", label: "Walking", factor: "0",     color: "#22c55e" },
      ].map((item, i) => (
        <div key={i} style={emptyStyles.factorCard}>
          <span style={emptyStyles.factorIcon}>{item.icon}</span>
          <span style={emptyStyles.factorLabel}>{item.label}</span>
          <span style={{ ...emptyStyles.factorValue, color: item.color }}>
            {item.factor === "0" ? "Zero" : item.factor} kg
          </span>
          <span style={emptyStyles.factorUnit}>CO₂ / km</span>
        </div>
      ))}
    </div>

    <p style={emptyStyles.demoNote}>
      💡 Running in demo mode? Set <code style={emptyStyles.code}>USE_DUMMY_DATA=true</code>{" "}
      in backend <code style={emptyStyles.code}>.env</code> — no API key needed!
    </p>
  </div>
);

const emptyStyles = {
  wrap: {
    textAlign: "center",
    padding: "56px 24px",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "20px",
    border: "1px dashed rgba(134,239,172,0.1)",
    marginBottom: "24px",
    animation: "fadeInUp 0.5s ease forwards",
  },
  iconRing: {
    width: "88px", height: "88px",
    borderRadius: "50%",
    background: "rgba(34,197,94,0.08)",
    border: "2px solid rgba(34,197,94,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 20px",
  },
  icon: { fontSize: "40px" },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "26px", fontWeight: "800",
    color: "#86efac", marginBottom: "12px", letterSpacing: "-0.5px",
  },
  text: {
    fontSize: "15px", color: "#6b7280",
    maxWidth: "460px", margin: "0 auto 32px", lineHeight: "1.65",
  },
  factorGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px", maxWidth: "520px", margin: "0 auto 28px",
  },
  factorCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px", padding: "16px 8px",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: "5px",
  },
  factorIcon: { fontSize: "26px" },
  factorLabel: {
    fontSize: "12px", fontWeight: "700",
    fontFamily: "'Syne', sans-serif", color: "#9ca3af",
  },
  factorValue: { fontSize: "16px", fontWeight: "800", fontFamily: "'Syne', sans-serif" },
  factorUnit: { fontSize: "10px", color: "#4b5563" },
  demoNote: {
    fontSize: "13px", color: "#4b5563",
    background: "rgba(0,0,0,0.2)",
    borderRadius: "10px", padding: "12px 20px",
    display: "inline-block", lineHeight: "1.6",
  },
  code: {
    background: "rgba(134,239,172,0.1)",
    color: "#86efac", padding: "1px 6px",
    borderRadius: "4px", fontFamily: "monospace", fontSize: "12px",
  },
};

/* ─── Main App Styles ────────────────────────────────────────────────────────── */
const styles = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #050f08 0%, #0a1f10 40%, #071409 100%)",
    position: "relative",
    overflowX: "hidden",
    fontFamily: "'DM Sans', sans-serif",
  },
  orb1: {
    position: "fixed", top: "-180px", right: "-180px",
    width: "600px", height: "600px",
    background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%)",
    borderRadius: "50%", pointerEvents: "none", zIndex: 0,
  },
  orb2: {
    position: "fixed", bottom: "-150px", left: "-150px",
    width: "500px", height: "500px",
    background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 65%)",
    borderRadius: "50%", pointerEvents: "none", zIndex: 0,
  },
  orb3: {
    position: "fixed", top: "40%", left: "30%",
    width: "300px", height: "300px",
    background: "radial-gradient(circle, rgba(22,163,74,0.03) 0%, transparent 70%)",
    borderRadius: "50%", pointerEvents: "none", zIndex: 0,
  },
  noiseOverlay: {
    position: "fixed", inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
    opacity: 0.4, pointerEvents: "none", zIndex: 0,
  },
  container: {
    maxWidth: "920px", margin: "0 auto",
    padding: "32px 20px 80px",
    position: "relative", zIndex: 1,
  },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "36px",
    flexWrap: "wrap", gap: "16px",
  },
  logo: { display: "flex", alignItems: "center", gap: "16px" },
  logoIconWrap: {
    width: "52px", height: "52px",
    background: "rgba(34,197,94,0.1)",
    border: "1px solid rgba(34,197,94,0.2)",
    borderRadius: "14px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoIcon: { fontSize: "28px" },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "30px", fontWeight: "800",
    color: "#86efac", letterSpacing: "-1px", lineHeight: 1,
  },
  logoSub: { fontSize: "12px", color: "#3d6b47", marginTop: "3px", letterSpacing: "0.5px" },
  headerRight: { display: "flex", alignItems: "center", gap: "10px" },
  tagBadge: {
    background: "rgba(34,197,94,0.1)",
    border: "1px solid rgba(34,197,94,0.2)",
    color: "#22c55e", padding: "6px 16px",
    borderRadius: "20px", fontSize: "13px", fontWeight: "600",
  },
  versionBadge: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#4b5563", padding: "6px 12px",
    borderRadius: "20px", fontSize: "12px",
  },
  hero: {
    marginBottom: "36px",
    animation: "fadeInUp 0.6s ease forwards",
  },
  heroTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "clamp(32px, 5vw, 52px)",
    fontWeight: "800", color: "#d1fae5",
    lineHeight: 1.15, letterSpacing: "-1.5px",
    marginBottom: "16px",
  },
  heroAccent: {
    background: "linear-gradient(90deg, #22c55e, #10b981)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: "17px", color: "#4b7a5a",
    maxWidth: "480px", lineHeight: "1.6",
  },
  results: { animation: "fadeInUp 0.5s ease forwards" },
  resultsBanner: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", flexWrap: "wrap", gap: "12px",
    background: "rgba(34,197,94,0.06)",
    border: "1px solid rgba(34,197,94,0.18)",
    borderRadius: "12px", padding: "14px 20px",
    fontSize: "14px", color: "#a7f3d0",
    marginBottom: "20px",
  },
  bannerLeft: { display: "flex", alignItems: "center", gap: "10px" },
  bannerDot: {
    width: "8px", height: "8px",
    borderRadius: "50%", background: "#22c55e",
    animation: "pulse 2s infinite",
    flexShrink: 0,
  },
  bannerBadges: { display: "flex", gap: "8px", flexWrap: "wrap" },
  ecoWinBadge: {
    background: "rgba(34,197,94,0.12)",
    color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)",
    padding: "4px 12px", borderRadius: "20px",
    fontSize: "12px", fontWeight: "700",
  },
  fastWinBadge: {
    background: "rgba(234,179,8,0.1)",
    color: "#eab308", border: "1px solid rgba(234,179,8,0.25)",
    padding: "4px 12px", borderRadius: "20px",
    fontSize: "12px", fontWeight: "700",
  },
  cardsSection: { marginTop: "8px" },
  sectionTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "17px", fontWeight: "700",
    color: "#86efac", marginBottom: "14px",
  },
  cardsGrid: { display: "grid", gap: "16px" },
  errorBox: {
    display: "flex", alignItems: "flex-start", gap: "14px",
    background: "rgba(239,68,68,0.07)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: "14px", padding: "18px 22px",
    color: "#fca5a5", marginBottom: "24px",
    animation: "fadeInUp 0.4s ease forwards",
  },
  errorIcon: { fontSize: "22px", flexShrink: 0, marginTop: "1px" },
  errorMsg: { fontSize: "15px", fontWeight: "500", marginBottom: "6px" },
  errorHint: { fontSize: "13px", color: "#9ca3af", lineHeight: "1.5" },
  code: {
    background: "rgba(134,239,172,0.08)",
    color: "#86efac", padding: "1px 6px",
    borderRadius: "4px", fontFamily: "monospace", fontSize: "12px",
  },
  footer: {
    textAlign: "center", marginTop: "56px",
    fontSize: "13px", color: "#2d4a35",
    display: "flex", justifyContent: "center",
    alignItems: "center", gap: "10px", flexWrap: "wrap",
  },
  footerDivider: { color: "#1a3020" },
};

export default App;
