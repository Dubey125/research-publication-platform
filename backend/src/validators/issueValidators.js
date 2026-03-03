import { body } from 'express-validator';

export const issueValidation = [
  body('volume').isInt({ min: 1 }).withMessage('Volume must be a positive integer'),
  body('issueNumber').isInt({ min: 1 }).withMessage('Issue number must be a positive integer'),
  body('year').isInt({ min: 1900, max: 3000 }).withMessage('Enter valid year'),
  body('title').optional().trim().isLength({ max: 200 }),
  body('isCurrent').optional().isBoolean()
];
