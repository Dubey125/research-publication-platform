import { Router } from 'express';
import {
  createEditorialMember,
  deleteEditorialMember,
  getEditorialMembers,
  updateEditorialMember
} from '../controllers/editorialController.js';
import { protect } from '../middlewares/auth.js';
import { uploadImage } from '../middlewares/upload.js';
import { handleValidation } from '../middlewares/validate.js';
import { editorialUpdateValidation, editorialValidation } from '../validators/editorialValidators.js';
import { idParamValidation } from '../validators/commonValidators.js';

const router = Router();

router.get('/', getEditorialMembers);
router.post('/', protect, uploadImage.single('photo'), editorialValidation, handleValidation, createEditorialMember);
router.put('/:id', protect, idParamValidation, uploadImage.single('photo'), editorialUpdateValidation, handleValidation, updateEditorialMember);
router.delete('/:id', protect, idParamValidation, handleValidation, deleteEditorialMember);

export default router;
