import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { verifyMailTransport } from './services/mailService.js';

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

const hasMinimumSecretStrength = (value) => typeof value === 'string' && value.trim().length >= 32;

const validateCriticalEnv = () => {
  if (!isProduction) return;

  if (!process.env.GOOGLE_RECAPTCHA_SECRET_KEY?.trim()) {
    throw new Error('Missing GOOGLE_RECAPTCHA_SECRET_KEY in production. Refusing to start without bot protection.');
  }

  if (!hasMinimumSecretStrength(process.env.JWT_SECRET)) {
    throw new Error('JWT_SECRET is too weak. Use at least 32 characters in production.');
  }

  const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!hasMinimumSecretStrength(refreshSecret)) {
    throw new Error('JWT_REFRESH_SECRET is too weak. Use at least 32 characters in production.');
  }

  const corsOrigins = (process.env.CORS_ORIGIN || process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (corsOrigins.length === 0) {
    throw new Error('CORS_ORIGIN (or CLIENT_URL) is required in production.');
  }

  const invalidOrigins = corsOrigins.filter((origin) => !/^https:\/\//i.test(origin));
  if (invalidOrigins.length > 0) {
    throw new Error('All production CORS origins must use HTTPS. Invalid origins: ' + invalidOrigins.join(', '));
  }
};

const listenOnPort = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve({ server, port }));
    server.on('error', reject);
  });

const startServer = async () => {
  try {
    validateCriticalEnv();
    await connectDB();
    await verifyMailTransport();

    let startPort = Number(PORT);
    let attempts = 0;

    while (attempts < 10) {
      try {
        const { port } = await listenOnPort(startPort);
        console.log(`Server running on port ${port}`);
        return;
      } catch (error) {
        if (error?.code === 'EADDRINUSE' && !isProduction) {
          console.warn(`Port ${startPort} is in use. Retrying on ${startPort + 1}...`);
          startPort += 1;
          attempts += 1;
          continue;
        }
        throw error;
      }
    }

    throw new Error('Unable to find an available port after 10 attempts.');
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
