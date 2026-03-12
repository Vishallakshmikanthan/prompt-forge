import { Router } from 'express';
import {
    addBookmark,
    removeBookmark,
    getUserBookmarks,
} from '../controllers/bookmarkController';
import { authenticate } from '../middleware/authMiddleware';
import { sensitiveRouteRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// /api/bookmarks/:id
router.post('/:id', sensitiveRouteRateLimiter, authenticate, addBookmark);
router.delete('/:id', sensitiveRouteRateLimiter, authenticate, removeBookmark);

// /api/bookmarks/me
router.get('/me', authenticate, getUserBookmarks);

export default router;
