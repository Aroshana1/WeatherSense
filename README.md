# WeatherSense - Weather Comfort Index

A secured full-stack MERN application that fetches live weather data for 10 major
cities, scores each city with a custom **Comfort Index formula** (0–100), and
displays the ranked results in a responsive React dashboard — gated behind Auth0
login with MFA.

---

## Quick Start

### Prerequisites

| Tool | Minimum version | Check with |
|------|----------------|------------|
| Node.js | 18.x | `node --version` |
| npm | 9.x | `npm --version` |
| MongoDB | 6.x (optional) | `mongod --version` |
| Auth0 account | Free tier | [auth0.com](https://auth0.com) |
| OpenWeatherMap API key | Free tier | [openweathermap.org/api](https://openweathermap.org/api) |

### 1. Clone and install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# → Edit backend/.env and fill in OWM_API_KEY, AUTH0_DOMAIN, AUTH0_AUDIENCE

# Frontend
cp frontend/.env.example frontend/.env
# → Edit frontend/.env and fill in VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID, VITE_AUTH0_AUDIENCE
```


Auth0 Dashboard configuration (disable signups, add users, enable MFA).

### 3. Start the servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

### 4. Open the app

Navigate to **http://localhost:5173** — you'll see the login screen.
Sign in with a whitelisted account → complete MFA → view the ranked dashboard.

---

## Project Structure

```
WeatherSense/
├── backend/                    Express API server
│   ├── src/
│   │   ├── config/             env.js, auth0.js
│   │   ├── data/cities.json    10 OWM city IDs
│   │   ├── middleware/         errorHandler.js, checkJwt.js
│   │   ├── services/           weatherService, comfortIndexService, cacheService
│   │   ├── routes/             weatherRoutes, debugRoutes
│   │ 
│   │   ├── app.js              Express app factory
│   │   └── server.js           HTTP entry point
│   └── tests/                  Jest unit tests 
├── frontend/                   React (Vite) dashboard
│   └── src/
│       ├── auth/               Auth0ProviderWithHistory
│       ├── components/         CityCard, CityList, LoginButton, LogoutButton
│       ├── hooks/              useWeatherData
│       └── pages/              Dashboard
├── docs/
│   └── README.md  
└── README.md                   This file
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/health` | 🌐 Public | Server liveness check |
| `GET` | `/api/weather` | 🔒 JWT | Ranked comfort scores for all cities |
| `GET` | `/api/debug/cache` | 🔒 JWT | Per-city cache HIT/MISS + TTL remaining |

---

## The Comfort Index Formula

> **Designed for explainability over meteorological precision.**

Score starts at 100. Each weather parameter is scored 0–100 independently
based on how far it falls outside an "ideal comfortable" range.
The five component scores are combined with weighted addition.

### Formula

```
componentScore(value, min, max, penaltyPerUnit) =
  if min ≤ value ≤ max:  100
  else:                  max(0,  100 − penaltyPerUnit × distanceFromRange(value, min, max))

visibilityScore(metres) = min(100, (metres / 8000) × 100)

finalScore = round(clamp(
  0.35 × tempScore
  + 0.25 × humidityScore
  + 0.20 × windScore
  + 0.10 × cloudScore
  + 0.10 × visibilityScore
, 0, 100))
```

### Parameter Table

| Parameter | Weight | Ideal Range | Penalty |
|-----------|--------|-------------|---------|
| Temperature (°C) | **35%** | 18–24°C | 2 pts / °C outside range |
| Humidity (%) | **25%** | 40–60% | 1 pt / % outside range |
| Wind Speed (m/s) | **20%** | 0–5 m/s | 4 pts / m/s **above** 5 only |
| Cloudiness (%) | **10%** | 20–50% | 0.5 pts / % outside range |
| Visibility (m) | **10%** | ≥ 8000 m = full marks | Linear ramp to 0 |

### Weight Reasoning

- **Temperature (35%)** — The single biggest driver of how outdoor weather *feels*. A 10°C deviation is immediately noticeable; no other parameter dominates comfort more.
- **Humidity (25%)** — High humidity makes heat oppressive (sweat doesn't evaporate); low humidity causes dryness. Scored independently for transparency even though it physiologically interacts with temperature.
- **Wind (20%)** — Light breeze is neutral or pleasant; strong wind is disruptive. The ideal range starts at 0 m/s — very low wind gets full marks, only speed *above* 5 m/s is penalised.
- **Cloudiness (10%)** — Partial shade (20–50%) is ideal: some protection from glare, not fully overcast. Minor factor because cloud preference is highly subjective.
- **Visibility (10%)** — Usually adequate; only extreme fog or storms produce dangerously low visibility. The linear ramp rewards any improvement from 0 to 8000 m, with full marks beyond.



> This formula treats each factor **independently and linearly** (additive model).
> Real physiological comfort uses non-linear interactions — for example, NOAA's
> Heat Index combines temperature AND humidity via a polynomial regression table.
> We chose the additive linear model for **transparency and explainability**:
> every weight and penalty can be justified verbally without a regression table.
> The trade-off is reduced meteorological accuracy for extreme combinations
> (e.g. 30°C at 90% humidity feels worse than the scores suggest separately).

---

## Cache Design

### Why cache?

Each `GET /api/weather` call triggers 10 parallel OpenWeatherMap API requests
(one per city). The free OWM tier allows 60 calls/minute globally. Without caching:

- 10 simultaneous users = 100 OWM calls/minute → rate limit exceeded
- Each request takes ~500ms for 10 parallel calls → unnecessary latency

### Implementation

| Decision | Choice | Reason |
|----------|--------|--------|
| Cache library | `node-cache` | Zero infrastructure, in-process, zero config |
| Cache key | City ID (integer, e.g. `1850147`) | Unique, stable, matches OWM's own ID system |
| TTL | 300 seconds (5 min) | Weather changes slowly; matches frontend poll interval |
| What is cached | Lean result object (not raw OWM JSON) | Smaller memory footprint; already shaped for the API response |
| Strategy | Cache-aside (check → MISS → fetch → store) | Simplest pattern; easy to explain |

### Cache flow

```
GET /api/weather → for each of 10 cities:
  cacheService.get(cityId)
    ├── HIT  → return stored data (no OWM call, ~0ms)
    └── MISS → axios.get(OWM) → cacheService.set(cityId, data, TTL=300s)
```

### Debug endpoint

`GET /api/debug/cache` (requires JWT) shows per-city HIT/MISS + seconds until expiry:

```json
{
  "summary": { "cacheHits": 10, "cacheMisses": 0, "ttlSeconds": 300 },
  "cities": [
    { "name": "Tokyo", "status": "HIT", "ttlRemainingSeconds": 247 },
    ...
  ]
}
```

### Trade-offs and production path

| Property | node-cache | Redis |
|----------|-----------|-------|
| Setup | Zero (in-process) | Separate server required |
| Persists across restarts | ❌ | ✅ (optional) |
| Shared across server instances | ❌ | ✅ |
| Suitable for | Single-server dev/demo | Multi-instance production |

**Production recommendation:** Replace `cacheService.js` with a Redis client
(`ioredis`). Because all callers go through the `cacheService` wrapper,
the rest of the codebase (routes, services) wouldn't change at all.

---

## Auth0 Integration — Configuration



### Summary of Auth0 settings required

| Setting | Value |
|---------|-------|
| Application Type | Single Page Application |
| Allowed Callback URLs | `http://localhost:5173` |
| Allowed Logout URLs | `http://localhost:5173` |
| Allowed Web Origins | `http://localhost:5173` |
| API Identifier (Audience) | `https://weather-comfort-api` |
| API Signing Algorithm | RS256 |
| Database Sign Ups | **Disabled** (whitelist only) |
| MFA Factor | Email |
| MFA Policy | **Always** |

### Why Authorization Code + PKCE (not Implicit Flow)?

**Implicit Flow** (deprecated) gave the access token directly in the URL hash
after login — trivially interceptable by browser history, logs, or a malicious
script.

**Authorization Code Flow** instead returns a short-lived, single-use **code**
in the URL. The token is only obtained by exchanging this code in a separate
server-to-server call — meaning the token itself never appears in a URL.

**PKCE extension** (Proof Key for Code Exchange) was added for SPAs because:
- SPAs run entirely in the browser — there is no safe place to store a `client_secret`
- Without a secret, what proves the token request came from the same client that initiated login?
- PKCE's answer: a one-time `code_verifier` + `code_challenge` pair generated fresh for each login

```
Login start:  browser generates code_verifier (random, 43-128 chars)
              derives code_challenge = base64url(SHA256(code_verifier))
              sends code_challenge to Auth0 with the login request

After login:  Auth0 returns ?code=XXXXX in the redirect URL
              browser sends code + code_verifier to Auth0's token endpoint
              Auth0 hashes code_verifier → must match stored code_challenge ✓
              Auth0 issues the JWT access token
```

Even if an attacker intercepts the `?code=XXXXX` in the URL, they can't exchange
it — they don't have the `code_verifier` that was only stored in sessionStorage
during that browser session.

### Why RS256 JWT verification?

Auth0 signs every access token with its **private RSA key** (held only by Auth0).
The backend verifies using the corresponding **public key**, fetched from:
```
https://<your-domain>/.well-known/jwks.json
```

This is asymmetric cryptography:
- Only Auth0 can **create** valid tokens (private key)
- Anyone (including your backend) can **verify** them (public key)
- Even if an attacker steals the backend source code, they can't forge tokens

---

## Known Limitations

| Limitation | Description | Production fix |
|------------|-------------|---------------|
| In-memory cache | Resets on every server restart; not shared across instances | Replace with Redis |
| 10 hardcoded cities | `cities.json` is static; adding a city requires redeployment | Store cities in MongoDB with a CRUD API |
| No user roles | Any whitelisted Auth0 user can see everything | Add RBAC roles in Auth0; check role claim in `checkJwt` |
| Free OWM tier | 60 calls/minute; the 10-city poll uses 10 of them | Upgrade OWM plan or switch to a bulk endpoint |
| Linear comfort formula | Ignores physiological interactions (heat index, wind chill) | Implement NOAA heat index; add wind chill below 10°C |
| No historical data storage | Past comfort scores are not persisted | Log scores to MongoDB on each fetch; use for the trend chart |

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 18 + Vite | Modern SPA; Fast Refresh for dev productivity |
| Styling | Tailwind CSS v3 | Utility-first; all class names explainable line by line |
| State / Data | `useWeatherData` custom hook | Encapsulates fetching + polling; reusable |
| HTTP client | axios | Auto-throws on 4xx/5xx; cleaner than raw fetch |
| Backend | Node.js + Express | Non-blocking I/O; familiar JavaScript across the stack |
| Authentication | Auth0 (`@auth0/auth0-react` + `express-oauth2-jwt-bearer`) | Industry-standard; PKCE + RS256 + JWKS rotation handled for us |
| Caching | `node-cache` | Zero-dependency; in-process; trivially explainable |
| Database | MongoDB + Mongoose |  for user whitelist persistence |
| Testing | Jest | unit tests for the pure comfort index function |

---

## Development Commands

```bash
# Backend
npm run dev      # nodemon — auto-restarts on file changes
npm start        # plain node — production mode
npm test         # Jest unit tests

# Frontend
npm run dev      # Vite dev server with HMR
npm run build    # Production bundle → dist/
npm run preview  # Preview the production build locally
```

---


