# PhantomPen

The repository is split into `client/` (Vite + React) and `server/` (Express + PostgreSQL).

## Run locally

1. Create a PostgreSQL database named `phantompen`.
2. Copy `server/.env.example` to `server/.env`, set `DATABASE_URL` and a random `JWT_SECRET` of at least 32 characters.
3. In `server/`, run `npm install` and `npm run dev`. The server creates its tables and indexes on startup.
4. In `client/`, run `npm install` and `npm run dev`. `client/.env` sets `VITE_API_URL=http://localhost:4000`.

The API allows credentialed requests from `CLIENT_ORIGIN` and stores the session in an HTTP-only cookie. For cross-site production deployments, set `COOKIE_SAME_SITE=none` and `COOKIE_SECURE=true`, and serve both origins over HTTPS.
