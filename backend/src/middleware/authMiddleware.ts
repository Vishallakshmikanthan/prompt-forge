import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

/**
 * Middleware to enforce authentication.
 * In a real application, this would verify a JWT or session.
 * For this implementation, it checks for a 'userId' in the body or 'Authorization' header.
 * Logs authentication failures for security auditing.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    // Check for userId in body, authorId, Authorization header, or user-id header
    const userId = req.body?.userId || req.body?.authorId || req.headers['authorization'] || req.headers['user-id'];

    if (!userId) {
        console.error('--- AUTHENTICATION FAILURE START ---');
        console.error(`[Security] Failed: ${req.method} ${req.originalUrl}`);
        console.error('Headers:', JSON.stringify(req.headers, null, 2));
        console.error('Body:', JSON.stringify(req.body, null, 2));
        console.error('--- AUTHENTICATION FAILURE END ---');

        const err: AppError = new Error('Authentication required');
        err.statusCode = 401;
        return next(err);
    }

    // Attach user identifier to request
    (req as any).user = { id: userId };
    next();
};
