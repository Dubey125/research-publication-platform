# IJAIF Backend (Node.js + Express + MongoDB)

Production-ready backend API for **International Journal of Advanced Interdisciplinary Frontiers (IJAIF)**.

## Features

- JWT-based admin authentication
- Issue, paper, editorial board, submission management
- Public APIs for home, current issue, archives
- PDF upload validation and storage (`uploads/`)
- Image upload support for editorial photos
- Input validation with `express-validator`
- Rate limiting and anti-spam honeypot fields
- Email notification to admin on new submission/contact message

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Copy environment file:
   ```bash
   cp .env.example .env
   ```
   On Windows PowerShell:
   ```powershell
   Copy-Item .env.example .env
   ```
3. Update `.env` values (`MONGODB_URI`, `JWT_SECRET`, SMTP).
4. Seed admin:
   ```bash
   npm run seed:admin
   ```
   If admin already exists and you need to overwrite credentials from env:
   ```bash
   npm run reset:admin
   ```
5. Start server:
   ```bash
   npm run dev
   ```

## Main API Endpoints

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/public/home`
- `GET /api/public/current-issue`
- `GET /api/public/archives`
- `POST /api/submissions` (public manuscript submission)
- `POST /api/contact`
- `GET/POST/PUT/DELETE /api/issues` (admin protected where applicable)
- `GET/POST/PUT/DELETE /api/papers` (admin protected where applicable)
- `GET/POST/PUT/DELETE /api/editorial` (admin protected where applicable)
- `GET/PATCH/DELETE /api/submissions` (admin)
- `GET /api/stats` (admin)

## Deployment (Render)

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add all environment variables from `.env`.
- Ensure MongoDB Atlas allows Render IP access.
