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
import { editorialValidation } from '../validators/editorialValidators.js';

const router = Router();

router.get('/', getEditorialMembers);
router.post('/', protect, uploadImage.single('photo'), editorialValidation, handleValidation, createEditorialMember);
router.put('/:id', protect, uploadImage.single('photo'), updateEditorialMember);
router.delete('/:id', protect, deleteEditorialMember);

export default router;
