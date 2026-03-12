import { Router } from 'express';
import * as discoveryController from '../controllers/discoveryController';

const router = Router();

router.get('/trending', discoveryController.getTrendingPrompts);
router.get('/top', discoveryController.getTopPrompts);
router.get('/new', discoveryController.getNewestPrompts);
router.get('/hot', discoveryController.getHotPrompts);

export default router;
