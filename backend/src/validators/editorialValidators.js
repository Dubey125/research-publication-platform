import { body } from 'express-validator';

export const editorialValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').isIn(['Editor-in-Chief', 'Associate Editor', 'Reviewer']).withMessage('Invalid role'),
  body('affiliation').trim().notEmpty().withMessage('Affiliation is required'),
  body('bio').optional().trim().isLength({ max: 1000 }),
  body('order').optional().isInt({ min: 0 })
];

export const editorialUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty').isLength({ max: 120 }),
  body('role').optional().isIn(['Editor-in-Chief', 'Associate Editor', 'Reviewer']).withMessage('Invalid role'),
  body('affiliation').optional().trim().notEmpty().withMessage('Affiliation cannot be empty').isLength({ max: 200 }),
  body('bio').optional().trim().isLength({ max: 1000 }),
  body('order').optional().isInt({ min: 0 })
];
