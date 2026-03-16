import { body } from 'express-validator';

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

export const profileValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail()
];

export const changePasswordValidation = [
  body('currentPassword').isLength({ min: 8 }).withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
];
