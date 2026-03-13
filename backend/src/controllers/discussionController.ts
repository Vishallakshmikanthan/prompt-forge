import { Request, Response, NextFunction } from 'express';
import * as discussionService from '../services/discussionService';
import { AppError } from '../middleware/errorHandler';

/**
 * GET /api/discussions
 * Returns all discussion threads.
 */
export const getAllDiscussions = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
        const discussions = await discussionService.getAllDiscussions(limit);
        res.status(200).json({
            status: 'success',
            data: discussions,
        });
    } catch (error) {
        next(error as AppError);
    }
};

/**
 * POST /api/discussions
 * Creates a new discussion thread.
 */
export const createDiscussion = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { title, excerpt, content, category, userId, tags } = req.body;

        if (!title || !content || !category || !userId) {
            const err: AppError = new Error('Missing required fields: title, content, category, userId');
            err.statusCode = 400;
            return next(err);
        }

        const newDiscussion = await discussionService.createDiscussion({
            title,
            excerpt: excerpt || content.substring(0, 150) + '...',
            content,
            category,
            userId,
            tags,
        });

        res.status(201).json({
            status: 'success',
            data: newDiscussion,
        });
    } catch (error) {
        next(error as AppError);
    }
};
