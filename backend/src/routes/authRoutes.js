import { Router } from 'express';
import { changePassword, getMe, loginAdmin, updateProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { loginLimiter } from '../middlewares/rateLimit.js';
import { handleValidation } from '../middlewares/validate.js';
import { loginValidation } from '../validators/authValidators.js';

const router = Router();

router.post('/login', loginLimiter, loginValidation, handleValidation, loginAdmin);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);
router.patch('/change-password', protect, changePassword);

export default router;

