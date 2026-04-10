import Admin from '../models/Admin.js';
import { hashToken, refreshCookieName, verifyRefreshToken } from '../utils/tokens.js';

export const requireCsrfToken = async (req, res, next) => {
  try {
    const csrfToken = req.headers['x-csrf-token'];
    if (!csrfToken || typeof csrfToken !== 'string') {
      return res.status(403).json({ success: false, message: 'Missing CSRF token.' });
    }

    const refreshToken = req.cookies?.[refreshCookieName];
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token missing.' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded?.id || decoded.type !== 'refresh') {
      return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
    }

    const admin = await Admin.findById(decoded.id).select('+csrfTokenHash +csrfTokenExpiresAt');
    const hashedCsrfToken = hashToken(csrfToken);

    if (
      !admin ||
      !admin.csrfTokenHash ||
      admin.csrfTokenHash !== hashedCsrfToken ||
      !admin.csrfTokenExpiresAt ||
      admin.csrfTokenExpiresAt < new Date()
    ) {
      return res.status(403).json({ success: false, message: 'Invalid CSRF token.' });
    }

    req.csrfAdminId = String(admin._id);
    return next();
  } catch (_error) {
    return res.status(403).json({ success: false, message: 'CSRF validation failed.' });
  }
};
