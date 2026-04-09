import { Router } from 'express';
import {
  createReviewerApplication,
  deleteReviewerApplication,
  getReviewerApplications,
  updateReviewerApplicationStatus
} from '../controllers/reviewerController.js';
import { protect } from '../middlewares/auth.js';
import { submissionLimiter } from '../middlewares/rateLimit.js';
import { handleValidation } from '../middlewares/validate.js';
import { idParamValidation } from '../validators/commonValidators.js';
import { reviewerApplicationValidation, reviewerStatusValidation } from '../validators/reviewerValidators.js';

const router = Router();

router.post('/', submissionLimiter, reviewerApplicationValidation, handleValidation, createReviewerApplication);
router.get('/', protect, getReviewerApplications);
router.patch('/:id/status', protect, idParamValidation, reviewerStatusValidation, handleValidation, updateReviewerApplicationStatus);
router.delete('/:id', protect, idParamValidation, handleValidation, deleteReviewerApplication);

export default router;
