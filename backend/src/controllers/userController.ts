import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { AppError } from '../middleware/errorHandler';

export const getUserProfile = async (
    req: Request<{ username: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username } = req.params;
        const profile = await userService.getUserProfile(username);
        
        if (!profile) {
            // Return skeleton data for resilience on dynamic user routes
            res.status(200).json({ 
                status: 'success', 
                data: {
                    username: username,
                    displayName: username,
                    reputation: 0,
                    bio: 'PromptForge User',
                    createdAt: new Date().toISOString(),
                    _count: { prompts: 0, bookmarks: 0 },
                    stats: {
                        promptsCreated: 0,
                        forksCreated: 0,
                        bookmarksSaved: 0,
                        totalLikes: 0,
                        totalForks: 0,
                        totalViews: 0
                    }
                } 
            });
            return;
        }
        res.status(200).json({ status: 'success', data: profile });
    } catch (error: any) {
        next(error);
    }
};

export const getUserPrompts = async (
    req: Request<{ username: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username } = req.params;
        const prompts = await userService.getUserPrompts(username);
        res.status(200).json({ status: 'success', data: prompts });
    } catch (error: any) {
        if (error.message === 'User not found') {
            error.statusCode = 404;
        }
        next(error);
    }
};

export const getUserForks = async (
    req: Request<{ username: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username } = req.params;
        const forks = await userService.getUserForks(username);
        res.status(200).json({ status: 'success', data: forks });
    } catch (error: any) {
        if (error.message === 'User not found') {
            error.statusCode = 404;
        }
        next(error);
    }
};

export const getUserBookmarks = async (
    req: Request<{ username: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username } = req.params;
        const bookmarks = await userService.getUserBookmarks(username);
        res.status(200).json({ status: 'success', data: bookmarks });
    } catch (error: any) {
        if (error.message === 'User not found') {
            error.statusCode = 404;
        }
        next(error);
    }
};

export const getLeaderboard = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const users = await userService.getLeaderboard(limit);
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ status: 'fail', message: 'Unauthorized' });
            return;
        }

        const data = await userService.updateProfile(userId, req.body);
        res.status(200).json({ status: 'success', data });
    } catch (error: any) {
        if (error.message === 'Username is already taken') {
            error.statusCode = 409;
        }
        next(error);
    }
};

export const getActivityGraph = async (
    req: Request<{ username: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username } = req.params;
        const data = await userService.getActivityGraph(username);
        res.status(200).json({ status: 'success', data });
    } catch (error: any) {
        if (error.message === 'User not found') error.statusCode = 404;
        next(error);
    }
};

export const getAnalytics = async (
    req: Request<{ username: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username } = req.params;
        const data = await userService.getAnalytics(username);
        res.status(200).json({ status: 'success', data });
    } catch (error: any) {
        if (error.message === 'User not found') error.statusCode = 404;
        next(error);
    }
};

export const getFeaturedPrompt = async (
    req: Request<{ username: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username } = req.params;
        const data = await userService.getFeaturedPrompt(username);
        res.status(200).json({ status: 'success', data });
    } catch (error: any) {
        if (error.message === 'User not found') error.statusCode = 404;
        next(error);
    }
};

export const getCollections = async (
    req: Request<{ username: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username } = req.params;
        const data = await userService.getCollections(username);
        res.status(200).json({ status: 'success', data });
    } catch (error: any) {
        if (error.message === 'User not found') error.statusCode = 404;
        next(error);
    }
};

export const getActivityTimeline = async (
    req: Request<{ username: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username } = req.params;
        const data = await userService.getActivityTimeline(username);
        res.status(200).json({ status: 'success', data });
    } catch (error: any) {
        if (error.message === 'User not found') error.statusCode = 404;
        next(error);
    }
};

export const getOwnProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ status: 'fail', message: 'Unauthorized' });
            return;
        }

        const profile = await userService.getUserProfile(userId);
        
        // If profile exists, return it with stats
        if (profile) {
            res.status(200).json({ 
                status: 'success', 
                data: {
                    user: {
                        id: profile.id,
                        username: profile.username,
                        email: profile.email,
                        joined_at: profile.createdAt
                    },
                    stats: {
                        prompts_created: profile.stats.promptsCreated,
                        bookmarks: profile.stats.bookmarksSaved,
                        forks: profile.stats.forksCreated,
                        reputation: profile.reputation ?? 0
                    }
                } 
            });
            return;
        }

        // If user not in DB (new user), return default guest structure
        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: userId,
                    username: 'New User',
                    email: '',
                    joined_at: new Date().toISOString()
                },
                stats: {
                    prompts_created: 0,
                    bookmarks: 0,
                    forks: 0,
                    reputation: 0
                }
            }
        });
    } catch (error: any) {
        next(error);
    }
};

