import Admin from '../models/Admin.js';
import generateToken from '../utils/generateToken.js';
import {
  accessTokenTtl,
  clearRefreshCookieOptions,
  generateRefreshToken,
  hashToken,
  refreshCookieName,
  refreshCookieOptions,
  refreshTokenExpiryDate,
  verifyRefreshToken
} from '../utils/tokens.js';

const issueSessionTokens = async (res, admin) => {
  const token = generateToken(admin._id);
  const refreshToken = generateRefreshToken(admin._id);
  admin.refreshTokenHash = hashToken(refreshToken);
  admin.refreshTokenExpiresAt = refreshTokenExpiryDate();
  await admin.save({ validateBeforeSave: false });

  res.cookie(refreshCookieName, refreshToken, refreshCookieOptions);

  return {
    token,
    accessToken: token,
    accessTokenExpiresIn: accessTokenTtl
  };
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select('+password +refreshTokenHash +refreshTokenExpiresAt');
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

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

    const admin = await Admin.findById(decoded.id).select('+refreshTokenHash +refreshTokenExpiresAt');
    const hashed = hashToken(refreshToken);

    if (
      !admin ||
      !admin.refreshTokenHash ||
      admin.refreshTokenHash !== hashed ||
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
            refreshTokenExpiresAt: null
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

