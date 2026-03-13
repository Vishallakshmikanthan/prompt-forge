import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { generateEmbedding, cosineSimilarity } from '../services/embeddingService';

/**
 * Perform a semantic search on prompts.
 * Endpoint: GET /api/search?q=query
 */
export const semanticSearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const query = req.query.q as string;

        if (!query || query.trim().length === 0) {
            res.status(200).json({ status: 'success', data: [] });
            return;
        }

        const prompts = await prisma.prompt.findMany({
            where: {
                moderationStatus: 'approved',
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { category: { contains: query, mode: 'insensitive' } },
                    { tags: { has: query } } // Note: array search might need adjustment depending on DB
                ]
            },
            include: {
                author: {
                    select: { id: true, username: true, avatarUrl: true }
                },
                analytics: true,
                _count: {
                    select: {
                        votes: true,
                        forkedPrompts: true,
                        bookmarks: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({ status: 'success', data: prompts });
        return;
    } catch (error) {
        next(error);
    }
};
