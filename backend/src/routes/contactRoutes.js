import { Router } from 'express';
import { sendContactMessage } from '../controllers/contactController.js';
import { submissionLimiter } from '../middlewares/rateLimit.js';
import { handleValidation } from '../middlewares/validate.js';
import { contactValidation } from '../validators/contactValidators.js';

const router = Router();

router.post('/', submissionLimiter, contactValidation, handleValidation, sendContactMessage);

export default router;
