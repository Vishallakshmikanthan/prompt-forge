import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import promptRoutes from './routes/promptRoutes';
import bookmarkRoutes from './routes/bookmarkRoutes';
import forkRoutes from './routes/forkRoutes';
import versionRoutes from './routes/versionRoutes';
import discoveryRoutes from './routes/discoveryRoutes';
import userRoutes from './routes/userRoutes';
import searchRoutes from './routes/searchRoutes';
import notificationRoutes from './routes/notificationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import discussionRoutes from './routes/discussionRoutes';
import statsRoutes from './routes/statsRoutes';
import profileRoutes from './routes/profileRoutes';
import securityHeaders from './middleware/securityHeaders';
import { apiRateLimiter } from './middleware/rateLimiter';
import errorHandler from './middleware/errorHandler';
import xss from 'xss-clean';
import { initMonitoring } from './config/monitoring';
import { requestMonitor } from './middleware/requestMonitor';
import * as Sentry from '@sentry/node';
import prisma from './config/prisma';

// Initialize Sentry
initMonitoring();

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ────────────────────────────────────────────────────────────────
// Custom request monitor for performance metrics
app.use(requestMonitor);

// Apply security headers first
app.use(securityHeaders);

// Apply rate limiting early
app.use('/api/', apiRateLimiter);

// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://prompt-forge-two-indol.vercel.app',
    'https://prompt-forge-two-indol.vercel.app/',
    'http://localhost:3000',
    'http://localhost:3001'
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            console.warn(`[CORS] Rejected origin: ${origin}`);
            callback(null, false); // Don't throw error, just reject
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', 'user-id', 'x-requested-with'],
    credentials: true,
    maxAge: 86400
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
    let dbStatus = 'unknown';
    try {
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = 'connected';
    } catch (error) {
        dbStatus = 'disconnected';
    }

    res.status(200).json({
        status: 'ok',
        message: 'PromptForge API is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: dbStatus
    });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/prompts', discoveryRoutes);
app.use('/api/prompts', recommendationRoutes);
app.use('/api/prompts', forkRoutes);
app.use('/api/prompts', versionRoutes);
app.use('/api/prompts', analyticsRoutes);
app.use('/api/prompts', promptRoutes);

app.use('/api/auth', require('./routes/authRoutes').default);
app.use('/api/bookmarks', bookmarkRoutes); // Updated prefix for clarity
app.use('/api/notifications', notificationRoutes); // Updated prefix for clarity
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/recommendations', recommendationRoutes); // For trending/personalized without 'prompts' prefix
app.use('/api/stats', statsRoutes);

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Sentry error handler must be before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const server = app.listen(PORT, async () => {
    console.log(`🚀 PromptForge API running on http://localhost:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
