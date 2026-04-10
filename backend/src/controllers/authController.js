import Admin from '../models/Admin.js';
import generateToken from '../utils/generateToken.js';
import {
  accessTokenTtl,
  csrfTokenExpiryDate,
  clearRefreshCookieOptions,
  generateCsrfToken,
  generateRefreshToken,
  hashToken,
  refreshCookieName,
  refreshCookieOptions,
  refreshTokenExpiryDate,
  verifyRefreshToken
} from '../utils/tokens.js';

const MAX_FAILED_LOGIN_ATTEMPTS = Number(process.env.MAX_FAILED_LOGIN_ATTEMPTS || 5);
const ACCOUNT_LOCK_MINUTES = Number(process.env.ACCOUNT_LOCK_MINUTES || 15);
const ACCOUNT_LOCK_MS = ACCOUNT_LOCK_MINUTES * 60 * 1000;

const issueSessionTokens = async (res, admin) => {
  const token = generateToken(admin._id);
  const refreshToken = generateRefreshToken(admin._id);
  const csrfToken = generateCsrfToken();
  admin.refreshTokenHash = hashToken(refreshToken);
  admin.refreshTokenExpiresAt = refreshTokenExpiryDate();
  admin.csrfTokenHash = hashToken(csrfToken);
  admin.csrfTokenExpiresAt = csrfTokenExpiryDate();
  await admin.save({ validateBeforeSave: false });

  res.cookie(refreshCookieName, refreshToken, refreshCookieOptions);

  return {
    token,
    accessToken: token,
    accessTokenExpiresIn: accessTokenTtl,
    csrfToken
  };
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail }).select(
      '+password +refreshTokenHash +refreshTokenExpiresAt +failedLoginAttempts +lockUntil'
    );

    if (admin?.lockUntil && admin.lockUntil > new Date()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to repeated failed login attempts. Please try again later.'
      });
    }

    if (!admin || !(await admin.comparePassword(password))) {
      if (admin) {
        admin.failedLoginAttempts = (admin.failedLoginAttempts || 0) + 1;
        if (admin.failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
          admin.lockUntil = new Date(Date.now() + ACCOUNT_LOCK_MS);
          admin.failedLoginAttempts = 0;
        }
        await admin.save({ validateBeforeSave: false });
      }

      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    admin.failedLoginAttempts = 0;
    admin.lockUntil = null;

    const session = await issueSessionTokens(res, admin);

    return res.json({
      success: true,
      ...session,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      { name, email },
      { new: true, runValidators: true }
    );
    return res.json({ success: true, admin });
  } catch (error) {
    return next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both currentPassword and newPassword are required.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });
    }

    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!(await admin.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ success: false, message: 'New password must be different from current password.' });
    }

    admin.password = newPassword;
    admin.refreshTokenHash = null;
    admin.refreshTokenExpiresAt = null;
    admin.csrfTokenHash = null;
    admin.csrfTokenExpiresAt = null;
    await admin.save();
    res.clearCookie(refreshCookieName, clearRefreshCookieOptions);
    return res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    return next(error);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[refreshCookieName];
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token missing.' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (decoded.type !== 'refresh' || !decoded.id) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
    }

    const admin = await Admin.findById(decoded.id).select('+refreshTokenHash +refreshTokenExpiresAt +csrfTokenHash +csrfTokenExpiresAt');
    const hashed = hashToken(refreshToken);

    if (admin?.refreshTokenHash && admin.refreshTokenHash !== hashed) {
      admin.refreshTokenHash = null;
      admin.refreshTokenExpiresAt = null;
      admin.csrfTokenHash = null;
      admin.csrfTokenExpiresAt = null;
      await admin.save({ validateBeforeSave: false });
      return res.status(401).json({ success: false, message: 'Session revoked. Please log in again.' });
    }

    if (
      !admin ||
      !admin.refreshTokenHash ||
      !admin.refreshTokenExpiresAt ||
      admin.refreshTokenExpiresAt < new Date()
    ) {
      return res.status(401).json({ success: false, message: 'Refresh token invalid or expired.' });
    }

    const session = await issueSessionTokens(res, admin);
    return res.json({
      success: true,
      ...session,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Refresh token invalid or expired.' });
  }
};

export const logoutAdmin = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[refreshCookieName];

    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        if (decoded?.id) {
          await Admin.findByIdAndUpdate(decoded.id, {
            refreshTokenHash: null,
            refreshTokenExpiresAt: null,
            csrfTokenHash: null,
            csrfTokenExpiresAt: null
          });
        }
      } catch (_error) {
        // Ignore invalid cookie payload and still clear cookie client-side.
      }
    }

    res.clearCookie(refreshCookieName, clearRefreshCookieOptions);
    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    return next(error);
  }
};

