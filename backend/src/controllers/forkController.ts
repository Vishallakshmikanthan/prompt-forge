import { Request, Response, NextFunction } from 'express';
import * as forkService from '../services/forkService';
import { AppError } from '../middleware/errorHandler';

/**
 * POST /api/prompts/:id/fork
 * Create a fork of a prompt.
 */
export const forkPrompt = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const originalPromptId = req.params['id'] as string;
        const { userId } = req.body;

        if (!userId) {
            const err: AppError = new Error('Authentication required to fork');
            err.statusCode = 401;
            return next(err);
        }

        const forkedPrompt = await forkService.createFork(userId, originalPromptId);

        res.status(201).json({
            status: 'success',
            data: forkedPrompt,
        });
    } catch (err: any) {
        if (err.message === 'Original prompt not found') {
            err.statusCode = 404;
        } else if (err.message === 'You cannot fork your own prompt') {
            err.statusCode = 400;
        }
        next(err as AppError);
    }
};
