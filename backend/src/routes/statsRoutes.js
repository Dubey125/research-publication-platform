import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.get('/', protect, getDashboardStats);

export default router;
