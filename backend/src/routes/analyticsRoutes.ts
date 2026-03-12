import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';

const router = Router();

router.post('/:id/view', analyticsController.trackPromptView);
router.get('/:id/analytics', analyticsController.getPromptAnalytics);

export default router;
