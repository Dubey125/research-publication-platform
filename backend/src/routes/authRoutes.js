import { Router } from 'express';
import { changePassword, getMe, loginAdmin, logoutAdmin, refreshSession, updateProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { loginLimiter } from '../middlewares/rateLimit.js';
import { handleValidation } from '../middlewares/validate.js';
import { changePasswordValidation, loginValidation, profileValidation } from '../validators/authValidators.js';

const router = Router();

router.post('/login', loginLimiter, loginValidation, handleValidation, loginAdmin);
router.post('/refresh', refreshSession);
router.post('/logout', logoutAdmin);
router.get('/me', protect, getMe);
router.patch('/profile', protect, profileValidation, handleValidation, updateProfile);
router.patch('/change-password', protect, changePasswordValidation, handleValidation, changePassword);

export default router;

