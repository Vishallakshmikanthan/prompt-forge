import { Router } from 'express';
import {
    getAllPrompts,
    getPromptById,
    createPrompt,
    votePrompt,
    updatePrompt,
    deletePrompt,
} from '../controllers/promptController';
import { authenticate } from '../middleware/authMiddleware';
import { promptValidation } from '../middleware/validation';
import { sensitiveRouteRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// GET /api/prompts
router.get('/', getAllPrompts);

// GET /api/prompts/:id
router.get('/:id', getPromptById);

// POST /api/prompts
router.post('/', authenticate, promptValidation, createPrompt);

// POST /api/prompts/:id/vote
router.post('/:id/vote', sensitiveRouteRateLimiter, authenticate, votePrompt);

// PATCH /api/prompts/:id
router.patch('/:id', authenticate, promptValidation, updatePrompt);

// DELETE /api/prompts/:promptId
router.delete('/:promptId', authenticate, deletePrompt);

export default router;
