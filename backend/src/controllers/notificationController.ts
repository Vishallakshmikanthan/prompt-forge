import { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notificationService';
import { AppError } from '../middleware/errorHandler';

export const getUserNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.headers['x-user-id'] as string | undefined;

        if (!userId) {
            const err: AppError = new Error('Authentication required');
            err.statusCode = 401;
            return next(err);
        }

        const notifications = await notificationService.getUserNotifications(userId);

        res.status(200).json({
            status: 'success',
            data: notifications,
        });
    } catch (err) {
        next(err as AppError);
    }
};

export const markNotificationAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.headers['x-user-id'] as string | undefined;
        const id = req.params['id'] as string;

        if (!userId) {
            const err: AppError = new Error('Authentication required');
            err.statusCode = 401;
            return next(err);
        }

        const result = await notificationService.markNotificationRead(id, userId);

        if (result.count === 0) {
            const err: AppError = new Error('Notification not found');
            err.statusCode = 404;
            return next(err);
        }

        res.status(200).json({
            status: 'success',
            data: { id, read: true },
        });
    } catch (err) {
        next(err as AppError);
    }
};

