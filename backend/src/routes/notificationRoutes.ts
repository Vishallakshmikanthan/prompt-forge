import { Router } from 'express';
import {
    getUserNotifications,
    markNotificationAsRead,
} from '../controllers/notificationController';

const router = Router();

// /api/notifications
router.get('/', getUserNotifications);

// /api/notifications/:id/read
router.patch('/:id/read', markNotificationAsRead);

export default router;

