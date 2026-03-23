import { Router } from 'express';
import {
  createAnnouncement,
  deleteAnnouncement,
  getAllAnnouncements,
  getAnnouncements,
  updateAnnouncement
} from '../controllers/announcementController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.get('/', getAnnouncements);
router.get('/admin', protect, getAllAnnouncements);
router.post('/', protect, createAnnouncement);
router.patch('/:id', protect, updateAnnouncement);
router.delete('/:id', protect, deleteAnnouncement);

export default router;
