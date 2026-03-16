import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const accessSecret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

export const accessTokenTtl = process.env.JWT_EXPIRES_IN || '15m';
export const refreshTokenTtl = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const msFromDuration = (duration) => {
  const value = String(duration).trim();
  const match = value.match(/^(\d+)([smhd])$/i);
  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return amount * multipliers[unit];
};

export const refreshCookieName = process.env.REFRESH_COOKIE_NAME || 'ijaif_refresh_token';

export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/api/auth',
  maxAge: msFromDuration(refreshTokenTtl)
};

export const clearRefreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/api/auth'
};

export const generateAccessToken = (adminId) => {
  if (!accessSecret) {
    throw new Error('JWT_SECRET is missing in environment variables.');
  }

  return jwt.sign({ id: adminId, type: 'access' }, accessSecret, {
    expiresIn: accessTokenTtl
  });
};

export const generateRefreshToken = (adminId) => {
  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET (or JWT_SECRET fallback) is missing in environment variables.');
  }

  return jwt.sign({ id: adminId, type: 'refresh' }, refreshSecret, {
    expiresIn: refreshTokenTtl
  });
};

export const verifyRefreshToken = (token) => jwt.verify(token, refreshSecret);

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const refreshTokenExpiryDate = () => new Date(Date.now() + msFromDuration(refreshTokenTtl));
