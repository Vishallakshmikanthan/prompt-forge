import { Request, Response, NextFunction } from 'express';

export const requestMonitor = (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const diff = process.hrtime(start);
        const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
        const { method, originalUrl } = req;
        const { statusCode } = res;

        // In a real production app, you might send this to Sentry, CloudWatch, or Datadog
        // Here we log it for demonstration and internal monitoring
        console.log(`[Metrics] ${method} ${originalUrl} - ${statusCode} - ${timeInMs}ms`);
    });

    next();
};
