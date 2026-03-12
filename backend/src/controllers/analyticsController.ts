import { Request, Response, NextFunction } from 'express';
import * as analyticsService from '../services/analyticsService';
import { AppError } from '../middleware/errorHandler';

/**
 * POST /api/prompts/:id/view
 * Tracks a prompt view.
 */
export const trackPromptView = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params['id'] as string;
        await analyticsService.incrementPromptView(id);
        res.status(200).json({
            status: 'success',
            message: 'View tracked',
        });
    } catch (err) {
        next(err as AppError);
    }
};

/**
 * GET /api/prompts/:id/analytics
 * Retrieves engagement metrics for a prompt.
 */
export const getPromptAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params['id'] as string;
        const analytics = await analyticsService.getPromptAnalytics(id);
        res.status(200).json({
            status: 'success',
            data: analytics,
        });
    } catch (err) {
        next(err as AppError);
    }
};
