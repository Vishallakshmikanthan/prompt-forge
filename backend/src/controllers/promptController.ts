import { Request, Response, NextFunction } from 'express';
import * as promptService from '../services/promptService';
import * as userService from '../services/userService';
import { AppError } from '../middleware/errorHandler';

/**
 * GET /api/prompts
 * Returns all prompts.
 */
export const getAllPrompts = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
        const cursor = req.query.cursor as string | undefined;
        const category = req.query.category as string | undefined;

        const prompts = await promptService.getAllPrompts(limit, cursor, category);
        res.status(200).json({
            status: 'success',
            data: prompts,
        });
    } catch (error) {
        next(error as AppError);
    }
};

/**
 * GET /api/prompts/:id
 * Returns a single prompt by ID.
 */
export const getPromptById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params['id'] as string;
        const prompt = await promptService.getPromptById(id);

        if (!prompt) {
            const err: AppError = new Error(`Prompt with id '${id}' not found`);
            err.statusCode = 404;
            return next(err);
        }

        res.status(200).json({
            status: 'success',
            data: prompt,
        });
    } catch (err) {
        next(err as AppError);
    }
};

/**
 * POST /api/prompts
 * Creates a new prompt.
 */
export const createPrompt = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { title, description, promptContent, category, aiModel, tags, authorId, parentPromptId, username, email, avatarUrl } = req.body;

        // Basic validation
        if (!title || !description || !promptContent || !category || !aiModel || !authorId) {
            const err: AppError = new Error(
                'Missing required fields: title, description, promptContent, category, aiModel, authorId'
            );
            err.statusCode = 400;
            return next(err);
        }

        // Sync user to local database if they don't exist
        if (username && email) {
            await userService.upsertUser({
                id: authorId,
                username,
                email,
                avatarUrl
            });
        }

        const newPrompt = await promptService.createPrompt({
            title,
            description,
            promptContent,
            category,
            aiModel,
            tags,
            authorId,
            parentPromptId,
        });

        res.status(201).json({
            status: 'success',
            data: newPrompt,
        });
    } catch (err) {
        next(err as AppError);
    }
};
/**
 * POST /api/prompts/:id/vote
 * Votes for a prompt and updates its score.
 */
export const votePrompt = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params['id'] as string;
        const { userId, voteType } = req.body;

        // In a real app, userId would come from authentication middleware (e.g. req.user.id)
        if (!userId) {
            const err: AppError = new Error('Authentication required to vote');
            err.statusCode = 401;
            return next(err);
        }

        if (voteType !== 'upvote') {
            const err: AppError = new Error('Invalid vote type. Only "upvote" is supported.');
            err.statusCode = 400;
            return next(err);
        }

        const result = await promptService.votePrompt(id, userId, voteType);

        res.status(200).json({
            status: 'success',
            data: result,
        });
    } catch (err: any) {
        if (err.message === 'User has already voted for this prompt') {
            err.statusCode = 400;
        } else if (err.message === 'Prompt not found') {
            err.statusCode = 404;
        }
        next(err as AppError);
    }
};

/**
 * PATCH /api/prompts/:id
 * Updates an existing prompt and creates a version.
 */
export const updatePrompt = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params['id'] as string;
        const updatedPrompt = await promptService.updatePrompt(id, req.body);

        res.status(200).json({
            status: 'success',
            data: updatedPrompt,
        });
    } catch (err: any) {
        if (err.message === 'Prompt not found') {
            err.statusCode = 404;
        }
        next(err as AppError);
    }
};
