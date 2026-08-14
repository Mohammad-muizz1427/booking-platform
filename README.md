# Booking Platform

Full-stack booking app: React frontend, Express API, Supabase Postgres.

## Project structure

```
booking-platform/
├── backend/
│   └── src/
│       ├── config/       # Database connection (Supabase Postgres via pg)
│       ├── controllers/  # Request handlers
│       ├── models/       # Data-access layer
│       ├── routes/       # Express route definitions
│       ├── app.js
│       └── server.js
└── frontend/
    └── src/
        ├── components/
        └── pages/
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [Supabase](https://supabase.com/) project with Postgres enabled

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — paste your Supabase connection string as DATABASE_URL
npm install
npm run dev
```

API runs at **http://localhost:5000**. Health check: **http://localhost:5000/api/health**

**Supabase connection string:** Project Settings → Database → Connection string → URI. For the Express server, use the **Transaction pooler** (port 6543) or **Direct** connection.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**. Vite proxies `/api` requests to the backend.

## Verify

1. Start the backend with a valid `DATABASE_URL`.
2. Start the frontend.
3. Open http://localhost:5173 — the homepage shows API and database status.

When connected, you should see:

```json
{
  "status": "ok",
  "database": "connected",
  "serverTime": "..."
}
```
