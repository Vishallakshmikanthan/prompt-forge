import { Router } from 'express';
import * as discussionController from '../controllers/discussionController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// GET /api/discussions
router.get('/', discussionController.getAllDiscussions);

// POST /api/discussions
router.post('/', authenticate, discussionController.createDiscussion);

export default router;
