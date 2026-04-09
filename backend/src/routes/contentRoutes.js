import { Router } from 'express';
import { getContentByType, syncDefaultContent, upsertContentByType } from '../controllers/contentController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/sync-defaults', protect, syncDefaultContent);
router.get('/:type', getContentByType);
router.post('/:type', protect, upsertContentByType);

export default router;
