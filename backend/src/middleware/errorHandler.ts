import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode?: number;
}

const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
): void => {
    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? 'Internal Server Error';
    const isProduction = process.env.NODE_ENV === 'production';

    // Log the error for internal auditing (more detail in dev, less in prod)
    if (isProduction) {
        console.error(`[Security Error] ${statusCode} - ${message} - Path: ${req.originalUrl} - IP: ${req.ip}`);
        if (statusCode === 500) {
            const Sentry = require('@sentry/node');
            Sentry.captureException(err);
        }
    } else {
        console.error(`[Error Details]`, err);
    }

    res.status(statusCode).json({
        status: 'error',
        message: isProduction && statusCode === 500 ? 'An internal error occurred. Please try again later.' : message,
        // Never expose stack trace to the client
    });
};

export default errorHandler;
