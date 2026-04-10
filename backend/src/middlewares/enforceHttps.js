export const enforceHttps = (req, res, next) => {
  const forceHttps = process.env.FORCE_HTTPS === 'true';
  if (!forceHttps || process.env.NODE_ENV !== 'production') {
    return next();
  }

  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }

  const host = req.headers.host;
  if (!host) {
    return res.status(400).json({ success: false, message: 'Missing host header.' });
  }

  return res.redirect(301, `https://${host}${req.originalUrl}`);
};
