import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { authenticate } from '../middleware/authMiddleware';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prismaClient = prisma as any;

type CommentAuthor = {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
};

const toCommentPayload = (comment: {
    id: string;
    content: string;
    upvotes: number;
    createdAt: Date;
    author: CommentAuthor;
    replies?: Array<{
        id: string;
        content: string;
        upvotes: number;
        createdAt: Date;
        author: CommentAuthor;
    }>;
}) => ({
    id: comment.id,
    content: comment.content,
    upvotes: comment.upvotes,
    createdAt: comment.createdAt,
    author: {
        id: comment.author.id,
        username: comment.author.username,
        displayName: comment.author.displayName,
        avatarUrl: comment.author.avatarUrl,
    },
    replies: (comment.replies ?? []).map((reply) => ({
        id: reply.id,
        content: reply.content,
        upvotes: reply.upvotes,
        createdAt: reply.createdAt,
        author: {
            id: reply.author.id,
            username: reply.author.username,
            displayName: reply.author.displayName,
            avatarUrl: reply.author.avatarUrl,
        },
    })),
});

// GET /api/prompts/:id/comments
router.get('/prompts/:id/comments', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const promptId = String(req.params.id ?? '');

        const comments = await prismaClient.comment.findMany({
            where: { promptId, parentId: null },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
                replies: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                displayName: true,
                                avatarUrl: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json({
            status: 'success',
            data: comments.map((comment: any) => toCommentPayload(comment)),
        });
    } catch (error) {
        next(error as AppError);
    }
});

// POST /api/prompts/:id/comments
router.post('/prompts/:id/comments', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const promptId = String(req.params.id ?? '');
        const content = String(req.body?.content ?? '').trim();
        const userId = String((req as any).user?.id ?? '');

        if (!content) {
            const err: AppError = new Error('Comment content is required');
            err.statusCode = 400;
            return next(err);
        }

        const prompt = await prisma.prompt.findUnique({ where: { id: promptId }, select: { id: true } });
        if (!prompt) {
            const err: AppError = new Error('Prompt not found');
            err.statusCode = 404;
            return next(err);
        }

        const comment = await prismaClient.comment.create({
            data: {
                content,
                promptId,
                authorId: userId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        res.status(201).json({
            status: 'success',
            data: toCommentPayload(comment),
        });
    } catch (error) {
        next(error as AppError);
    }
});

// POST /api/comments/:commentId/replies
router.post('/comments/:commentId/replies', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params;
        const content = String(req.body?.content ?? '').trim();
        const userId = String((req as any).user?.id ?? '');

        if (!content) {
            const err: AppError = new Error('Reply content is required');
            err.statusCode = 400;
            return next(err);
        }

        const parentComment = await prismaClient.comment.findUnique({
            where: { id: commentId },
            select: { id: true, promptId: true, parentId: true },
        });

        if (!parentComment) {
            const err: AppError = new Error('Parent comment not found');
            err.statusCode = 404;
            return next(err);
        }

        if (parentComment.parentId) {
            const err: AppError = new Error('Only one nested reply level is allowed');
            err.statusCode = 400;
            return next(err);
        }

        const reply = await prismaClient.comment.create({
            data: {
                content,
                promptId: parentComment.promptId,
                authorId: userId,
                parentId: parentComment.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        res.status(201).json({
            status: 'success',
            data: toCommentPayload(reply),
        });
    } catch (error) {
        next(error as AppError);
    }
});

// POST /api/comments/:commentId/upvote
router.post('/comments/:commentId/upvote', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params;
        const userId = String((req as any).user?.id ?? '');

        const comment = await prismaClient.comment.findUnique({
            where: { id: commentId },
            select: { id: true, upvotes: true },
        });

        if (!comment) {
            const err: AppError = new Error('Comment not found');
            err.statusCode = 404;
            return next(err);
        }

        const existingVote = await prismaClient.commentVote.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId,
                },
            },
            select: { id: true },
        });

        if (existingVote) {
            const updated = await prismaClient.$transaction(async (tx: any) => {
                await tx.commentVote.delete({ where: { id: existingVote.id } });
                return tx.comment.update({
                    where: { id: commentId },
                    data: { upvotes: { decrement: 1 } },
                    select: { upvotes: true },
                });
            });

            const safeUpvotes = Math.max(0, updated.upvotes);
            if (safeUpvotes !== updated.upvotes) {
                await prismaClient.comment.update({
                    where: { id: commentId },
                    data: { upvotes: safeUpvotes },
                });
            }

            res.status(200).json({
                status: 'success',
                data: {
                    upvoted: false,
                    upvotes: safeUpvotes,
                },
            });
            return;
        }

        const updated = await prismaClient.$transaction(async (tx: any) => {
            await tx.commentVote.create({
                data: {
                    userId,
                    commentId,
                },
            });

            return tx.comment.update({
                where: { id: commentId },
                data: { upvotes: { increment: 1 } },
                select: { upvotes: true },
            });
        });

        res.status(200).json({
            status: 'success',
            data: {
                upvoted: true,
                upvotes: updated.upvotes,
            },
        });
    } catch (error) {
        next(error as AppError);
    }
});

// DELETE /api/comments/:commentId
router.delete('/comments/:commentId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params;
        const userId = String((req as any).user?.id ?? '');

        const comment = await prismaClient.comment.findUnique({
            where: { id: commentId },
            select: { id: true, authorId: true },
        });

        if (!comment) {
            const err: AppError = new Error('Comment not found');
            err.statusCode = 404;
            return next(err);
        }

        if (comment.authorId !== userId) {
            const err: AppError = new Error('You can only delete your own comments');
            err.statusCode = 403;
            return next(err);
        }

        await prismaClient.comment.delete({ where: { id: commentId } });

        res.status(200).json({
            status: 'success',
            data: { deleted: true },
        });
    } catch (error) {
        next(error as AppError);
    }
});

export default router;
