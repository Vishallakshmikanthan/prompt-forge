import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.patch('/update', authenticate, userController.updateProfile);
router.patch('/me/profile', authenticate, userController.updatePublicProfile);
router.get('/feed', authenticate, userController.getFeed);
router.get('/leaderboard', userController.getLeaderboard);
router.get('/:username/activity', userController.getActivityGraph);
router.get('/:username/analytics', userController.getAnalytics);
router.get('/:username/featured', userController.getFeaturedPrompt);
router.get('/:username/collections', userController.getCollections);
router.get('/:username/timeline', userController.getActivityTimeline);
router.get('/:username', userController.getUserProfile);
router.get('/:username/prompts', userController.getUserPrompts);
router.get('/:username/forks', userController.getUserForks);
router.get('/:username/bookmarks', userController.getUserBookmarks);
router.post('/:id/follow', authenticate, userController.toggleFollow);
router.get('/:id/follow-status', userController.getFollowStatus);

export default router;

