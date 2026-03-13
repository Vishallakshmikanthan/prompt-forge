import { Router } from 'express';
import * as statsController from '../controllers/statsController';

const router = Router();

router.get('/categories', statsController.getCategoryStats);
router.get('/community', statsController.getCommunityStats);

export default router;
