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
import { submissionValidation } from '../validators/submissionValidators.js';

const router = Router();

router.post('/', submissionLimiter, uploadPdf.single('manuscript'), submissionValidation, handleValidation, createSubmission);
router.get('/', protect, getSubmissions);
router.patch('/:id/status', protect, updateSubmissionStatus);
router.delete('/:id', protect, deleteSubmission);

export default router;
