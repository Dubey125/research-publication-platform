import { body } from 'express-validator';

const categories = [
  'Engineering & Technology',
  'Computer Science & Artificial Intelligence',
  'Management & Commerce',
  'Applied Sciences',
  'Social Sciences & Humanities',
  'Environmental & Sustainability Studies',
  'Interdisciplinary Innovations'
];

export const paperValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 300 }),
  body('authors').custom((value) => {
    const arr = Array.isArray(value) ? value : String(value || '').split(',').map((x) => x.trim()).filter(Boolean);
    if (!arr.length) throw new Error('At least one author is required');
    return true;
  }),
  body('abstract').trim().notEmpty().withMessage('Abstract is required').isLength({ max: 5000 }),
  body('keywords').optional(),
  body('category').isIn(categories).withMessage('Invalid category'),
  body('issue').isMongoId().withMessage('Valid issue id is required')
];

export const paperUpdateValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 300 }),
  body('authors').optional().custom((value) => {
    const arr = Array.isArray(value) ? value : String(value || '').split(',').map((x) => x.trim()).filter(Boolean);
    if (!arr.length) throw new Error('At least one author is required');
    return true;
  }),
  body('abstract').optional().trim().notEmpty().withMessage('Abstract cannot be empty').isLength({ max: 5000 }),
  body('keywords').optional(),
  body('category').optional().isIn(categories).withMessage('Invalid category'),
  body('issue').optional().isMongoId().withMessage('Valid issue id is required')
];
