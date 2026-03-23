import { Router } from 'express';
import { getContentByType, upsertContentByType } from '../controllers/contentController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.get('/:type', getContentByType);
router.post('/:type', protect, upsertContentByType);

export default router;
