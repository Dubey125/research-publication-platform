import { param } from 'express-validator';

export const idParamValidation = [
  param('id').isMongoId().withMessage('Invalid resource id')
];
