import { Router } from 'express';
import { changePassword, getMe, loginAdmin, logoutAdmin, refreshSession, updateProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { authLimiter, loginLimiter } from '../middlewares/rateLimit.js';
import { requireTrustedOrigin } from '../middlewares/trustedOrigin.js';
import { handleValidation } from '../middlewares/validate.js';
import { changePasswordValidation, loginValidation, profileValidation } from '../validators/authValidators.js';

const router = Router();

router.use(authLimiter);
router.post('/login', requireTrustedOrigin, loginLimiter, loginValidation, handleValidation, loginAdmin);
router.post('/refresh', requireTrustedOrigin, refreshSession);
router.post('/logout', requireTrustedOrigin, logoutAdmin);
router.get('/me', protect, getMe);
router.patch('/profile', protect, profileValidation, handleValidation, updateProfile);
router.patch('/change-password', protect, changePasswordValidation, handleValidation, changePassword);

export default router;

