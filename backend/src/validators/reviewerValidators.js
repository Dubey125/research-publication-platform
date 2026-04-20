import { body } from 'express-validator';

export const reviewerApplicationValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required').isLength({ max: 120 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('contactNumber')
    .trim()
    .notEmpty().withMessage('Contact number is required')
    .isLength({ min: 7, max: 25 }).withMessage('Contact number must be between 7 and 25 characters')
    .matches(/^[+()\-\s\d]+$/).withMessage('Contact number contains invalid characters'),
  body('affiliation').trim().notEmpty().withMessage('Affiliation is required').isLength({ max: 200 }),
  body('designation').trim().notEmpty().withMessage('Designation is required').isLength({ max: 150 }),
  body('expertiseAreas').trim().notEmpty().withMessage('Expertise areas are required').isLength({ max: 500 }),
  body('experienceSummary').trim().notEmpty().withMessage('Experience summary is required').isLength({ min: 20, max: 4000 }),
  body('motivation').trim().notEmpty().withMessage('Motivation is required').isLength({ min: 20, max: 3000 }),
  body('declarationAccepted').custom((value) => value === true || value === 'true').withMessage('Declaration must be accepted'),
  body('honeypot').optional().custom((value) => !value).withMessage('Spam detected')
];

export const reviewerStatusValidation = [
  body('status').isIn(['Pending', 'Approved', 'Rejected']).withMessage('Invalid status'),
  body('adminNotes').optional().trim().isLength({ max: 2000 })
];
