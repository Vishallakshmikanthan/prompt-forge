import { Router } from 'express';
import { forkPrompt } from '../controllers/forkController';
import { authenticate } from '../middleware/authMiddleware';
import { sensitiveRouteRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// POST /api/prompts/:id/fork
router.post('/:id/fork', sensitiveRouteRateLimiter, authenticate, forkPrompt);

export default router;
