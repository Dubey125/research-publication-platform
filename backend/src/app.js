  import path from 'path';
  import express from 'express';
  import cors from 'cors';
  import cookieParser from 'cookie-parser';
  import helmet from 'helmet';
  import hpp from 'hpp';
  import morgan from 'morgan';
  import mongoSanitize from 'express-mongo-sanitize';
  import { fileURLToPath } from 'url';
  import { globalLimiter, writeLimiter } from './middlewares/rateLimit.js';
  import { enforceHttps } from './middlewares/enforceHttps.js';
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
  import contentRoutes from './routes/contentRoutes.js';
  import announcementRoutes from './routes/announcementRoutes.js';
  import reviewerRoutes from './routes/reviewerRoutes.js';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', process.env.TRUST_PROXY || 1);
  app.use(enforceHttps);

  const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'];
  const configuredOrigins = (process.env.CORS_ORIGIN || process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const isProduction = process.env.NODE_ENV === 'production';
  const coopPolicy = process.env.COOP_POLICY || 'same-origin';
  const coepPolicy = process.env.COEP_POLICY || 'require-corp';
  const corpPolicy = process.env.CORP_POLICY || 'cross-origin';

  // Do not allow localhost defaults in production unless explicitly configured.
  const allowedOrigins = isProduction
    ? configuredOrigins
    : [...defaultOrigins, ...configuredOrigins];

  const corsOrigin = (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    // Allow any localhost origin in development, or strict check
    if (allowedOrigins.includes(origin) || (!isProduction && origin.startsWith('http://localhost:'))) {
      return callback(null, true);
    }

    return callback(new Error('CORS origin not allowed: ' + origin));
  };

  app.use(
    helmet({
      // Explicitly set cross-origin isolation-related headers.
      crossOriginOpenerPolicy: { policy: coopPolicy },
      crossOriginEmbedderPolicy: coepPolicy === 'unsafe-none' ? false : { policy: coepPolicy },
      crossOriginResourcePolicy: { policy: corpPolicy },
      referrerPolicy: { policy: 'no-referrer' },
      hsts: isProduction
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: false
          }
        : false,
    })
  );
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
    })
  );
  app.options('*', cors({ origin: corsOrigin, credentials: true }));
  app.use(globalLimiter);
  app.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return writeLimiter(req, res, next);
    }
    return next();
  });
  app.use(cookieParser());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: false, limit: '2mb' }));
  app.use(mongoSanitize());
  app.use(hpp());

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'API healthy' });
  });

  app.get('/api/ping', (_req, res) => {
    res.type('text/plain').send('ok');
  });

  app.use(
    '/uploads',
    express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads'), {
      index: false,
      dotfiles: 'deny',
      maxAge: '7d',
      setHeaders: (res) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
      }
    })
  );

  app.use('/api/auth', authRoutes);
  app.use('/auth', authRoutes);
  app.use('/api/public', publicRoutes);
  app.use('/api/issues', issueRoutes);
  app.use('/api/papers', paperRoutes);
  app.use('/api/submissions', submissionRoutes);
  app.use('/api/editorial', editorialRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/content', contentRoutes);
  app.use('/api/announcements', announcementRoutes);
  app.use('/api/reviewers', reviewerRoutes);

  /* ── Serve built React app (production / tunnel mode) ──────── */
  // const distPath = path.join(__dirname, '../../frontend/dist');
  // app.use(express.static(distPath));
  // // SPA fallback — any non-API route returns index.html
  // app.get(/^(?!\/api).*/, (_req, res) => {
  //   res.sendFile(path.join(distPath, 'index.html'));
  // });
app.get('/', (_req, res) => {
  res.send('API is running 🚀');
});

  app.use(notFound);
  app.use(errorHandler);

  export default app;
