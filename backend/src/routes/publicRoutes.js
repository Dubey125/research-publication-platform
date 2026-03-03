import { Router } from 'express';
import { getArchiveData, getCurrentIssueWithPapers, getHomeData } from '../controllers/publicController.js';

const router = Router();

router.get('/home', getHomeData);
router.get('/current-issue', getCurrentIssueWithPapers);
router.get('/archives', getArchiveData);

export default router;
