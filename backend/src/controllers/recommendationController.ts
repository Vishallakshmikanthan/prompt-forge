import { Request, Response, NextFunction } from 'express';
import * as recommendationService from '../services/recommendationService';
import * as discoveryService from '../services/discoveryService';
import { AppError } from '../middleware/errorHandler';

export const getSimilarPromptRecommendations = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;
        if (!id) {
            const err: AppError = new Error('Invalid prompt ID');
            err.statusCode = 400;
            return next(err);
        }
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
        const recommendations = await recommendationService.getSimilarPrompts(id as string, limit);
        res.status(200).json({ status: 'success', data: recommendations });
    } catch (error: any) {
        next(error);
    }
};



export const getPersonalizedRecommendations = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // In a real app, userId would come from authenticated req.user
        // For now, we'll take it from query or header if provided, else return trending
        const userIdRaw = req.query.userId || req.headers['x-user-id'];
        const userId = typeof userIdRaw === 'string' ? userIdRaw : undefined;

        if (!userId) {
            // If no user, just return trending as a fallback
            const recommendations = await discoveryService.getTrendingPrompts(10);
            res.status(200).json({ status: 'success', data: recommendations });
            return;
        }

        const recommendations = await recommendationService.getPersonalizedPrompts(userId);
        res.status(200).json({ status: 'success', data: recommendations });
    } catch (error: any) {
        next(error);
    }
};
