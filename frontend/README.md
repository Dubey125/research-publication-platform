# IJAIF Frontend (React + Vite + Tailwind CSS)

Frontend for **International Journal of Advanced Interdisciplinary Frontiers (IJAIF)**.

## Features

- Responsive academic UI (mobile/tablet/desktop)
- Public pages (Home, About, Aims & Scope, Editorial Board, Guidelines, Ethics, Peer Review, Current Issue, Archives, Contact)
- Dynamic latest papers/current issue/archive with filters/search/pagination
- Public manuscript submission form
- Secure admin login + dashboard management
- SEO meta tags and generated sitemap
- Sticky navbar, loading spinner, 404 page, smooth animations

## Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Create `.env` and configure:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_FILE_BASE_URL=http://localhost:5000
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Generate sitemap:
   ```bash
   npm run generate:sitemap
   ```

## Build

```bash
npm run build
```

## Deployment

### Vercel

- Import `frontend` directory as project
- Build command: `npm run build`
- Output directory: `dist`
- Add environment variables:
  - `VITE_API_URL=https://<render-backend-url>/api`
  - `VITE_FILE_BASE_URL=https://<render-backend-url>`

### Important

Enable CORS in backend `.env` with your deployed frontend URL in `CLIENT_URL`.
