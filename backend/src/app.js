import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import { fileURLToPath } from 'url';
import { globalLimiter } from './middlewares/rateLimit.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import paperRoutes from './routes/paperRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import editorialRoutes from './routes/editorialRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(globalLimiter);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(hpp());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API healthy' });
});

app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/editorial', editorialRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);

/* ── Serve built React app (production / tunnel mode) ──────── */
const distPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(distPath));
// SPA fallback — any non-API route returns index.html
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

export default app;
