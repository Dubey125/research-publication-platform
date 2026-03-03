# International Journal of Advanced Interdisciplinary Frontiers (IJAIF)

**Tagline:** Bridging Disciplines, Advancing Knowledge

A full-stack journal management system for handling public journal content, manuscript submissions, and admin operations.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB (local or Atlas)
- **Auth:** JWT (admin)
- **Uploads:** PDF manuscripts/papers + editorial photos

## Repository Structure

```text
Journal Management System/
├── backend/     # Express API + MongoDB models + uploads
└── frontend/    # React (Vite) client
```

## Key Features

- Public pages (Home, About, Aims & Scope, Ethics, Peer Review, Guidelines, Contact)
- Dynamic current issue and archives
- Public manuscript submission and contact forms
- Admin authentication and protected dashboard
- Issue, paper, editorial board, and submission management
- Dashboard statistics
- SEO support (`react-helmet-async`), sitemap, and robots.txt
- Validation, security headers, rate limiting, anti-spam honeypot

---

## Local Development Setup

## 1) Backend Setup

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Update `backend/.env` with real values.

Minimum required values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ijaif
JWT_SECRET=replace_with_a_64_byte_hex_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=15
```

Optional (for email notifications):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
ADMIN_NOTIFY_EMAIL=admin@ijaif.org
```

Admin seed values (used by script):

```env
SEED_ADMIN_EMAIL=admin@ijaif.org
SEED_ADMIN_PASSWORD=ChangeMe123!
SEED_ADMIN_NAME=IJAIF Administrator
```

Seed admin and run backend:

```powershell
npm run seed:admin
npm run dev
```

Backend runs at: `http://localhost:5000`

## 2) Frontend Setup

```powershell
cd ..\frontend
npm install
Copy-Item .env.example .env
```

`frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FILE_BASE_URL=http://localhost:5000
```

Run frontend:

```powershell
npm run dev
```

Frontend runs at: `http://localhost:5173`

Optional: generate sitemap

```powershell
npm run generate:sitemap
```

---

## API Overview

### Public

- `GET /api/public/home`
- `GET /api/public/current-issue`
- `GET /api/public/archives`
- `POST /api/submissions`
- `POST /api/contact`

### Auth/Admin

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/POST/PUT/DELETE /api/issues`
- `GET/POST/PUT/DELETE /api/papers`
- `GET/POST/PUT/DELETE /api/editorial`
- `GET/PATCH/DELETE /api/submissions`
- `GET /api/stats`

---

## Deployment Guide (Vercel + Render)

Recommended order:

1. Create MongoDB Atlas database
2. Deploy backend on Render
3. Deploy frontend on Vercel
4. Update backend `CLIENT_URL` with your Vercel domain
5. Re-deploy backend (if needed)

## A) Deploy Backend to Render

Create a new **Web Service** from this repository and set:

- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

Set these Render environment variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://<your-vercel-domain>
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=15

# Optional SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<email>
SMTP_PASS=<app-password>
ADMIN_NOTIFY_EMAIL=<admin-email>

# Optional seed values
SEED_ADMIN_EMAIL=<admin-email>
SEED_ADMIN_PASSWORD=<strong-password>
SEED_ADMIN_NAME=IJAIF Administrator
```

After deployment, note your backend URL (example):

`https://ijaif-backend.onrender.com`

## B) Deploy Frontend to Vercel

Create a new Vercel project from this repository and set:

- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

Set these Vercel environment variables:

```env
VITE_API_URL=https://<your-render-domain>/api
VITE_FILE_BASE_URL=https://<your-render-domain>
```

Deploy and copy your Vercel production domain.

## C) Final CORS Check

Ensure Render backend `CLIENT_URL` exactly matches your Vercel frontend URL (including `https://`).

---

## Build Commands

From each app directory:

```powershell
# backend
cd backend
npm start

# frontend
cd ..\frontend
npm run build
npm run preview
```

---

## Troubleshooting

- **CORS error in browser:** verify backend `CLIENT_URL` is your exact Vercel URL.
- **401 on admin APIs:** verify JWT secret and login credentials.
- **Cannot connect to MongoDB:** check Atlas IP/network access and URI format.
- **File URLs broken:** verify `VITE_FILE_BASE_URL` points to backend base domain.
- **No email notifications:** confirm SMTP settings and app password.

---

## Security Notes

- Never commit `.env` files.
- Use a strong random `JWT_SECRET` in production.
- Rotate admin seed credentials after first login.
- Keep dependencies updated.

---

## License

This project is licensed under the MIT License.
