import { Router } from 'express';
import {
  createPaper,
  deletePaper,
  getPaperById,
  getPapers,
  updatePaper
} from '../controllers/paperController.js';
import { protect } from '../middlewares/auth.js';
import { uploadPdf } from '../middlewares/upload.js';
import { handleValidation } from '../middlewares/validate.js';
import { paperValidation } from '../validators/paperValidators.js';

const router = Router();

router.get('/', getPapers);
router.get('/:id', getPaperById);
router.post('/', protect, uploadPdf.single('pdf'), paperValidation, handleValidation, createPaper);
router.put('/:id', protect, uploadPdf.single('pdf'), updatePaper);
router.delete('/:id', protect, deletePaper);

export default router;
