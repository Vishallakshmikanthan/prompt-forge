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
import authRoutes from './routes/authRoutes';
import commentsRoutes from './routes/comments';
import playgroundRoutes from './routes/playground';
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

// Required for Render/Vercel to handle rate limiting and IP discovery correctly
app.set('trust proxy', 1);

// Top-level diagnostic route (before any middleware)
app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});
const PORT = process.env.PORT || 4000;

// ─── Middleware ────────────────────────────────────────────────────────────────
// Custom request monitor for performance metrics
app.use(requestMonitor);

// Temporarily disabled security headers and rate limiting for debugging connectivity
// Apply security headers first
// app.use(securityHeaders);

// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://prompt-forge-two-indol.vercel.app',
    'https://prompt-forge-two-indol.vercel.app/',
    'http://localhost:3000',
    'http://localhost:3001'
].filter(Boolean) as string[];

// Enable CORS for all origins during debugging to rule out CORS as the cause of 404 symptoms
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', 'user-id', 'x-requested-with']
}));

// Request Logger early in the stack
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin || 'None'}`);
    next();
});

// ─── Health Check & Root ─────────────────────────────────────────────────────
// These MUST be before rate limiting and other middleware to verify connectivity
app.get('/', (req, res) => res.status(200).send('PromptForge API is Running'));
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
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// Apply rate limiting early
app.use('/api', apiRateLimiter);

app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/prompts', discoveryRoutes);
app.use('/api/prompts', recommendationRoutes);
app.use('/api/prompts', forkRoutes);
app.use('/api/prompts', versionRoutes);
app.use('/api/prompts', analyticsRoutes);
app.use('/api/prompts', promptRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/playground', playgroundRoutes);
app.use('/api', commentsRoutes);

// 404 Handler for missing API routes (must be after all other /api routes)
app.use('/api', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `API Route ${req.originalUrl} not found`
    });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Sentry error handler must be before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
    console.log(`🚀 PromptForge API is starting...`);
    console.log(`📡 Server listening on ${bind}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔑 SENTRY_DSN: ${process.env.SENTRY_DSN ? 'Configured' : 'Missing'}`);
    console.log(`🔗 FRONTEND_URL: ${process.env.FRONTEND_URL || 'Not Set'}`);
});

export default app;
