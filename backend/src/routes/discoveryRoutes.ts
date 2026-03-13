import { Router } from 'express';
import * as discoveryController from '../controllers/discoveryController';

const router = Router();

router.get('/trending', discoveryController.getTrendingPrompts);
router.get('/popular', discoveryController.getPopularPrompts);
router.get('/top', discoveryController.getTopPrompts);
router.get('/new', discoveryController.getNewestPrompts);
router.get('/latest', discoveryController.getNewestPrompts); // Alias for latest
router.get('/hot', discoveryController.getHotPrompts);

export default router;
