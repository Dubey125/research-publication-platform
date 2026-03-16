import { Router } from 'express';
import {
  createSubmission,
  deleteSubmission,
  getSubmissions,
  updateSubmissionStatus
} from '../controllers/submissionController.js';
import { protect } from '../middlewares/auth.js';
import { submissionLimiter } from '../middlewares/rateLimit.js';
import { uploadPdf } from '../middlewares/upload.js';
import { handleValidation } from '../middlewares/validate.js';
import { submissionStatusValidation, submissionValidation } from '../validators/submissionValidators.js';
import { idParamValidation } from '../validators/commonValidators.js';

const router = Router();

router.post('/', submissionLimiter, uploadPdf.single('manuscript'), submissionValidation, handleValidation, createSubmission);
router.get('/', protect, getSubmissions);
router.patch('/:id/status', protect, idParamValidation, submissionStatusValidation, handleValidation, updateSubmissionStatus);
router.delete('/:id', protect, idParamValidation, handleValidation, deleteSubmission);

export default router;
