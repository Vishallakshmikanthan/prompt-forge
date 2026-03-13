import { Request, Response, NextFunction } from 'express';
import * as statsService from '../services/statsService';
import { AppError } from '../middleware/errorHandler';

/**
 * GET /api/stats/categories
 * Returns prompt counts per category.
 */
export const getCategoryStats = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const stats = await statsService.getCategoryStats();
        res.status(200).json({
            status: 'success',
            data: stats,
        });
    } catch (error) {
        next(error as AppError);
    }
};

/**
 * GET /api/stats/community
 * Returns overall community metrics and trending topics.
 */
export const getCommunityStats = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const stats = await statsService.getCommunityStats();
        res.status(200).json({
            status: 'success',
            data: stats,
        });
    } catch (error) {
        next(error as AppError);
    }
};
