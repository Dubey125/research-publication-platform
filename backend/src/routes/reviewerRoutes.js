import { Router } from 'express';
import {
  createReviewerApplication,
  deleteReviewerApplication,
  getReviewerApplications,
  updateReviewerApplicationStatus
} from '../controllers/reviewerController.js';
import { protect } from '../middlewares/auth.js';
import { submissionLimiter } from '../middlewares/rateLimit.js';
import { uploadReviewerPhoto } from '../middlewares/upload.js';
import { handleValidation } from '../middlewares/validate.js';
import { idParamValidation } from '../validators/commonValidators.js';
import { reviewerApplicationValidation, reviewerStatusValidation } from '../validators/reviewerValidators.js';

const router = Router();

router.post('/', submissionLimiter, (req, res, next) => {
  uploadReviewerPhoto.single('photoUrl')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'Profile photo must be less than 1MB.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, reviewerApplicationValidation, handleValidation, createReviewerApplication);
router.get('/', protect, getReviewerApplications);
router.patch('/:id/status', protect, idParamValidation, reviewerStatusValidation, handleValidation, updateReviewerApplicationStatus);
router.delete('/:id', protect, idParamValidation, handleValidation, deleteReviewerApplication);

export default router;
