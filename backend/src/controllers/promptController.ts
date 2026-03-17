import { Request, Response, NextFunction } from 'express';
import * as promptService from '../services/promptService';
import * as userService from '../services/userService';
import { AppError } from '../middleware/errorHandler';
import { pingIndexNow } from '../utils/indexNow';

// In-memory store for duplicate submission detection: "userId:title:content" -> timestamp (ms)
const recentSubmissions = new Map<string, number>();
const DUPLICATE_WINDOW_MS = 5000; // 5 seconds

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

        // Duplicate submission guard: reject identical content from same user within 5 seconds
        const submissionKey = `${authorId}:${title}:${promptContent}`;
        const lastSubmitted = recentSubmissions.get(submissionKey);
        if (lastSubmitted && Date.now() - lastSubmitted < DUPLICATE_WINDOW_MS) {
            const err: AppError = new Error('Duplicate submission detected. Please wait a moment before resubmitting.');
            err.statusCode = 409;
            return next(err);
        }
        recentSubmissions.set(submissionKey, Date.now());
        // Evict stale entries to prevent unbounded memory growth
        for (const [key, ts] of recentSubmissions.entries()) {
            if (Date.now() - ts >= DUPLICATE_WINDOW_MS) {
                recentSubmissions.delete(key);
            }
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

        // Ping IndexNow fire-and-forget
        pingIndexNow([`https://prompt-forge-two-indol.vercel.app/prompts/${newPrompt.id}`]);
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

/**
 * DELETE /api/prompts/:promptId
 * Deletes a prompt. Only the original author may delete their own prompt.
 */
export const deletePrompt = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const promptId = req.params['promptId'] as string;
        const requestingUserId = (req as any).user?.id;

        if (!requestingUserId) {
            const err: AppError = new Error('Authentication required');
            err.statusCode = 401;
            return next(err);
        }

        await promptService.deletePrompt(promptId, requestingUserId);

        res.status(200).json({
            status: 'success',
            message: 'Prompt deleted successfully',
        });
    } catch (err: any) {
        if (err.statusCode) {
            return next(err as AppError);
        }
        next(err as AppError);
    }
};
