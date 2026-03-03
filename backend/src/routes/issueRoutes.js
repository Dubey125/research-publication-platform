import { Router } from 'express';
import { createIssue, deleteIssue, getIssues, updateIssue } from '../controllers/issueController.js';
import { protect } from '../middlewares/auth.js';
import { handleValidation } from '../middlewares/validate.js';
import { issueValidation } from '../validators/issueValidators.js';

const router = Router();

router.get('/', getIssues);
router.post('/', protect, issueValidation, handleValidation, createIssue);
router.put('/:id', protect, issueValidation, handleValidation, updateIssue);
router.delete('/:id', protect, deleteIssue);

export default router;
