# 🌿 GreenRoute — Carbon-Aware Sustainable Travel Recommendation System

> Plan smarter journeys. Pollute less. Choose the path that's good for you — and the planet.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup Guide](#setup-guide)
- [API Reference](#api-reference)
- [Eco Score Algorithm](#eco-score-algorithm)
- [Emission Factors](#emission-factors)
- [Screenshots](#screenshots)
- [Environment Variables](#environment-variables)

---

## Overview

GreenRoute recommends travel routes based on **carbon emissions**, not just speed or distance. It fetches multiple route options via Google Maps API (or uses smart dummy data), calculates CO₂ for each route based on vehicle type, and ranks them with an **Eco Score** to help you make the most sustainable travel decision.

---

## Features

✅ Source & destination input with swap button  
✅ Vehicle type selector: Car, Bike, Bus, Walking  
✅ Multiple route options with detailed breakdown  
✅ CO₂ calculation per route using emission factors  
✅ **Eco Score** (0–100) for each route  
✅ Visual badge labels: Fastest ⚡ and Eco-Friendly 🌿  
✅ Interactive bar chart: Emissions / Eco Scores / Distance  
✅ CO₂ equivalents (e.g. "charges X smartphones")  
✅ Eco tips per vehicle type  
✅ MongoDB route history persistence  
✅ Dummy data fallback (no API key needed for demo)  
✅ Fully responsive dark green UI  

---

## Tech Stack

| Layer     | Technology                                         |
|-----------|----------------------------------------------------|
| Frontend  | React.js, Recharts, Inline CSS, .css , .jsx , .html|
| Backend   | Node.js, Express.js                                |
| Database  | MongoDB + Mongoose                                 |
| Maps API  | Google Maps Directions API                         |
| Fonts     | Syne (headings) + DM Sans (body)                   |

---

## Folder Structure

```
greenroute/
├── backend/
│   ├── controllers/
│   │   ├── emissionService.js      # CO2 calculation + Eco Score logic
│   │   ├── emissionController.js   # POST /calculate-emission handler
│   │   └── routeController.js      # POST /route handler + Google Maps
│   ├── routes/
│   │   ├── routeRoutes.js          # Express route for /api/route
│   │   └── emissionRoutes.js       # Express route for /api/calculate-emission
│   ├── models/
│   │   └── RouteSearch.js          # Mongoose schema for route history
│   ├── server.js                   # Express app entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── SearchForm.js       # Source/destination/vehicle input form
    │   │   ├── RouteCard.js        # Individual route info card
    │   │   ├── EmissionChart.js    # Recharts comparison bar chart
    │   │   └── LoadingSpinner.js   # Loading indicator
    │   ├── hooks/
    │   │   └── useRoutes.js        # Custom hook: fetch + state management
    │   ├── services/
    │   │   └── api.js              # Axios API service layer
    │   ├── App.js                  # Root component
    │   └── index.js                # React entry point
    ├── package.json
    └── .env.example
```

---

## Setup Guide

### Prerequisites
- Node.js v18 or higher
- npm v9+
- MongoDB (local install or MongoDB Atlas free tier)
- Optional: Google Maps API Key (works without it using dummy data)

---

### Step 1 — Clone / Create the Project

```bash
# If using Git
git clone <your-repo-url>
cd greenroute

# Or create manually and copy all files as per the structure above
```

---

### Step 2 — Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env

# Edit .env with your values:
#   MONGODB_URI=mongodb://localhost:27017/greenroute
#   GOOGLE_MAPS_API_KEY=your_key_here   (optional)
#   USE_DUMMY_DATA=true                 (set false to use real API)

# Start the backend server (development mode with auto-restart)
npm run dev

# You should see:
# ✅ MongoDB connected
# 🌿 GreenRoute Server running at http://localhost:5000
```

---

### Step 3 — Frontend Setup

```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env

# Edit .env:
#   REACT_APP_API_URL=http://localhost:5000/api

# Start the React dev server
npm start

# Opens at http://localhost:3000
```

---

### Step 4 — Verify Everything Works

```bash
# Backend health check
curl http://localhost:5000/health
# → {"status":"OK","message":"GreenRoute API is running 🌿"}

# Test route endpoint
curl -X POST http://localhost:5000/api/route \
  -H "Content-Type: application/json" \
  -d '{"source":"Delhi","destination":"Agra","vehicleType":"car"}'

# Test emission calculation
curl -X POST http://localhost:5000/api/calculate-emission \
  -H "Content-Type: application/json" \
  -d '{"distanceKm":200,"vehicleType":"car"}'
```

---

## API Reference

### `POST /api/route`

Fetch and compare routes between two locations.

**Request Body:**
```json
{
  "source": "Delhi",
  "destination": "Agra",
  "vehicleType": "car"
}
```

**vehicleType options:** `car` | `bike` | `bus` | `walking`

**Response:**
```json
{
  "success": true,
  "dataSource": "dummy",
  "query": { "source": "Delhi", "destination": "Agra", "vehicleType": "car" },
  "routes": [
    {
      "label": "Route via Highway",
      "distanceKm": 241.9,
      "durationMin": 290,
      "co2Kg": 46.445,
      "ecoScore": 62,
      "summary": "Delhi → Highway → Agra",
      "isFastest": false,
      "isEcoFriendly": false,
      "vehicleType": "car"
    }
  ],
  "meta": {
    "totalRoutes": 3,
    "fastestRoute": "Route via Highway",
    "ecoRoute": "Route via City Roads"
  }
}
```

---

### `POST /api/calculate-emission`

Calculate CO₂ for a specific distance + vehicle.

**Request Body:**
```json
{
  "distanceKm": 50,
  "vehicleType": "car",
  "durationMin": 60
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "distanceKm": 50,
    "vehicleType": "car",
    "co2Kg": 9.6,
    "emissionFactor": 0.192
  },
  "comparison": [
    { "vehicle": "car",     "co2Kg": 9.6,   "emissionFactor": 0.192 },
    { "vehicle": "bike",    "co2Kg": 5.15,  "emissionFactor": 0.103 },
    { "vehicle": "bus",     "co2Kg": 5.25,  "emissionFactor": 0.105 },
    { "vehicle": "walking", "co2Kg": 0,     "emissionFactor": 0 }
  ],
  "tip": "Moderate emissions. Consider public transport for greener travel ♻️"
}
```

---

## Eco Score Algorithm

```
ecoScore = emissionScore + timeScore

emissionScore = (1 − co2 / maxCo2) × 70    → up to 70 points
timeScore     = (1 − time / maxTime) × 30   → up to 30 points

Final score: 0–100 (higher = greener + reasonable time)
```

| Score Range | Rating    | Meaning                          |
|-------------|-----------|----------------------------------|
| 75 – 100    | Excellent | Very low emissions, fast route   |
| 50 – 74     | Good      | Low emissions with minor delays  |
| 25 – 49     | Fair      | Moderate emissions               |
| 0 – 24      | Poor      | High emissions or very slow      |

---

## Emission Factors

| Vehicle | CO₂ Factor    | Notes                          |
|---------|---------------|--------------------------------|
| Car     | 0.192 kg/km   | Average petrol/diesel car      |
| Bike    | 0.103 kg/km   | Motorbike/scooter              |
| Bus     | 0.105 kg/km   | Per passenger, public bus      |
| Walking | 0 kg/km       | Zero emissions 🌱              |

*Source: UK Department for Environment, Food & Rural Affairs (DEFRA) transport emission factors.*

---

## Environment Variables

### Backend `.env`

| Variable             | Required | Default                              | Description                              |
|----------------------|----------|--------------------------------------|------------------------------------------|
| `PORT`               | No       | `5000`                               | Server port                              |
| `MONGODB_URI`        | No       | `mongodb://localhost:27017/greenroute`| MongoDB connection string               |
| `GOOGLE_MAPS_API_KEY`| No       | —                                    | Maps API key (omit to use dummy data)    |
| `USE_DUMMY_DATA`     | No       | `true`                               | Force dummy data mode                    |

### Frontend `.env`

| Variable                  | Required | Default                        | Description           |
|---------------------------|----------|--------------------------------|-----------------------|
| `REACT_APP_API_URL`       | No       | `http://localhost:5000/api`    | Backend API base URL  |
| `REACT_APP_GOOGLE_MAPS_KEY`| No      | —                              | For optional map embed|

---

## Screenshots

### Home / Empty State
- Dark forest-green gradient background
- GreenRoute logo with leaf icon
- Hero headline: "Travel smarter. Pollute less."
- Emission factor reference cards (Car / Bike / Bus / Walking)

### Search Form
- Two location inputs with ⇅ swap button
- 4 vehicle mode buttons (with emission factor shown per vehicle)
- Green gradient "Find Eco Routes" button

### Results Page
- Live indicator banner: routes found + eco winner badge
- Bar chart with 3 tabs: Emissions | Eco Scores | Distance
- Route cards showing: distance, time, CO₂ grams, Eco Score ring
- Color-coded score bars (green/yellow/orange/red)
- Eco tips with CO₂ savings calculated

---

## Google Maps API Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project
3. Enable **Directions API** and **Distance Matrix API**
4. Go to Credentials → Create API Key
5. Paste the key into `backend/.env` as `GOOGLE_MAPS_API_KEY=...`
6. Set `USE_DUMMY_DATA=false`

Without a key, the app runs perfectly in demo mode using realistic generated data.

---

## License

MIT License — free to use, modify, and distribute.

---

*Built with 💚 for sustainable travel and a greener planet.*
