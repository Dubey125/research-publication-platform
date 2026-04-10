const localOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174'
];

const configuredOrigins = () =>
  (process.env.CORS_ORIGIN || process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    return configuredOrigins();
  }
  return [...localOrigins, ...configuredOrigins()];
};

export const requireTrustedOrigin = (req, res, next) => {
  // Non-browser clients (no Origin header) are allowed in non-production for local scripts.
  const origin = req.headers.origin;
  if (!origin) {
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }
    return res.status(403).json({ success: false, message: 'Origin header is required.' });
  }

  if (!allowedOrigins().includes(origin)) {
    return res.status(403).json({ success: false, message: 'Untrusted request origin.' });
  }

  return next();
};
