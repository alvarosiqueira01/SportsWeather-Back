  # SportsWeather-Back

## Project structure

```
SportsWeather-Back/        ← main app (Express + TypeScript)
  src/
    server.ts              ← entrypoint
    app.ts                 ← Express setup, routes, middleware
    config/                ← env.ts, mongo.ts
    routes/                ← auth, users, locations, weather, reports
    controllers/           ← request handlers
    services/              ← openmeteo.service.ts, scoring.service.ts, auth.service.ts, weather.service.ts
    repositories/          ← MongoDB data access
    models/                ← Mongoose schemas
    middlewares/           ← auth, validation, error handler
    schemas/               ← Zod validation schemas
    dtos/                  ← TypeScript interfaces
    utils/                 ← heatIndex, windChill, jwt, scoring

SportsWeather-Database/    ← MongoDB infra (Docker + seed)
  docker-compose.yml       ← mongo:8, port 27017
  mongo-init/init.js       ← user creation + indexes
  seed/seed.ts             ← `npm run seed` (test data)
```

## Commands

| Command | Run in | Action |
|---|---|---|
| `npm run dev` | root | Dev server via `ts-node-dev --respawn src/server.ts` |
| `npm run build` | root | `tsc` → `dist/` |
| `npm start` | root | `node dist/server.js` |
| `npm test` | root | `jest` (no test files exist yet) |
| `docker compose up -d` | `SportsWeather-Database/` | Start MongoDB 8 container |
| `npm run seed` | `SportsWeather-Database/seed/` | Populate DB with test data |
| `docker compose down -v` | `SportsWeather-Database/` | Wipe DB volume + restart clean |

## Database setup order

1. `docker compose up -d` (from `SportsWeather-Database/`)
2. `npm run seed` (from `SportsWeather-Database/seed/`)
3. `npm run dev` (from root)

## API routes

| Route | Auth | Description |
|---|---|---|
| `POST /api/auth/login` | No | Login, returns JWT token |
| `POST /api/auth/register` | No | Register user (Zod-validated) |
| `GET /api/users/profile` | JWT | Get profile |
| `PUT /api/users/preferences` | JWT | Update sport preferences |
| `GET /api/locations/favorites` | JWT | List favorite locations |
| `POST /api/locations/favorites` | JWT | Save favorite location |
| `GET /api/locations/history` | JWT | Search history |
| `GET /api/weather/evaluate` | No | Evaluate weather conditions for a sport |
| `POST /api/reports/generate` | No | Generate report |
| `GET /api/reports/download` | No | Download report |
| `GET /health` | No | Health check |

## Key technical details

- **Port:** 8080 (via `PORT` env, default)
- **Mongo URI:** `mongodb://weather_user:weather_pass@localhost:27017/weather_app?authSource=weather_app`
- **JWT secret:** `JWT_SECRET` env var
- **Auth:** Bearer token in `Authorization` header; verify logic in `middlewares/auth.middleware.ts`
- **Validation:** Zod schemas via `validate()` middleware wrapping `body`, `query`, `params`
- **Weather provider:** Open-Meteo (free, no API key) → `services/openmeteo.service.ts`
- **Custom calculations:** Heat index (`utils/heatIndex.ts`), wind chill (`utils/windChill.ts`), comfort scoring (`services/scoring.service.ts`)

## Seed test users

| email | password | role |
|---|---|---|
| `athlete@test.com` | `123456` | user |
| `admin@test.com` | `123456` | admin |

## MongoDB collections

`users`, `user_preferences`, `favorite_locations` (2dsphere index), `weather_cache` (TTL 1h), `weather_history` (2dsphere index), `user_search_history` (TTL ~180d), `system_logs` (TTL 30d), `generated_reports`
