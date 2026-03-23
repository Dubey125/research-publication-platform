import { body } from 'express-validator';

export const submissionValidation = [
  body('authorName').trim().notEmpty().withMessage('Author name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('affiliation').trim().notEmpty().withMessage('Affiliation is required'),
  body('paperTitle').trim().notEmpty().withMessage('Paper title is required'),
  body('abstract').trim().notEmpty().withMessage('Abstract is required').isLength({ max: 5000 }),
  body('declarationAccepted').custom((value) => value === true || value === 'true').withMessage('Declaration must be accepted'),
  body('honeypot').optional().custom((value) => !value).withMessage('Spam detected')
];

export const submissionStatusValidation = [
  body('status')
    .isIn(['Pending', 'Under Review', 'Accepted', 'Rejected'])
    .withMessage('Invalid status'),
  body('adminNotes').optional().trim().isLength({ max: 2000 })
];
