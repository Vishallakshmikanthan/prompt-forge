import { Request, Response, NextFunction } from 'express';
import * as bookmarkService from '../services/bookmarkService';
import { AppError } from '../middleware/errorHandler';

/**
 * POST /api/prompts/:id/bookmark
 * Saves a prompt to user's bookmarks.
 */
export const addBookmark = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const promptId = req.params['id'] as string;
        const { userId } = req.body;

        if (!userId) {
            const err: AppError = new Error('Authentication required to bookmark');
            err.statusCode = 401;
            return next(err);
        }

        const bookmark = await bookmarkService.addBookmark(userId, promptId);

        res.status(201).json({
            status: 'success',
            data: bookmark,
        });
    } catch (err: any) {
        if (err.message === 'Prompt already bookmarked') {
            err.statusCode = 400;
        }
        next(err as AppError);
    }
};

/**
 * DELETE /api/prompts/:id/bookmark
 * Removes a prompt from user's bookmarks.
 */
export const removeBookmark = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const promptId = req.params['id'] as string;
        const { userId } = req.body;

        if (!userId) {
            const err: AppError = new Error('Authentication required to unbookmark');
            err.statusCode = 401;
            return next(err);
        }

        await bookmarkService.removeBookmark(userId, promptId);

        res.status(200).json({
            status: 'success',
            message: 'Bookmark removed',
        });
    } catch (err) {
        next(err as AppError);
    }
};

/**
 * GET /api/users/me/bookmarks
 * Retrieves all bookmarks for the current user.
 */
export const getUserBookmarks = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // In a real app, userId would come from token/session
        // For now, we'll expect it in query or body for simulation, 
        // but typically 'me' implies session lookup.
        const userId = req.headers['x-user-id'] || req.query['userId'];

        if (!userId) {
            const err: AppError = new Error('Authentication required');
            err.statusCode = 401;
            return next(err);
        }

        const bookmarks = await bookmarkService.getUserBookmarks(userId as string);

        res.status(200).json({
            status: 'success',
            data: bookmarks.map(b => b.prompt), // Return just the prompts
        });
    } catch (err) {
        next(err as AppError);
    }
};
