import { body } from 'express-validator';

export const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 2000 }),
  body('honeypot').optional().custom((value) => !value).withMessage('Spam detected')
];
