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
import { paperUpdateValidation, paperValidation } from '../validators/paperValidators.js';
import { idParamValidation } from '../validators/commonValidators.js';

const router = Router();

router.get('/', getPapers);
router.get('/:id', idParamValidation, handleValidation, getPaperById);
router.post('/', protect, uploadPdf.single('pdf'), paperValidation, handleValidation, createPaper);
router.put('/:id', protect, idParamValidation, uploadPdf.single('pdf'), paperUpdateValidation, handleValidation, updatePaper);
router.delete('/:id', protect, idParamValidation, handleValidation, deletePaper);

export default router;
