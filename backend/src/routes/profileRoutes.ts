import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// GET /api/profile
router.get('/', authenticate, userController.getOwnProfile);

export default router;
