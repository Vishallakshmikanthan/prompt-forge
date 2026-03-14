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
                    { tags: { has: query } }
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

        // Since this is a semantic search endpoint, we should provide a similarity score
        // For now, we calculate a basic score based on keyword matches if full vector search is not implemented
        const resultsWithSimilarity = prompts.map(prompt => {
            let score = 0.5; // Base score for being in the results

            const lowerQuery = query.toLowerCase();
            const lowerTitle = prompt.title.toLowerCase();
            const lowerDesc = prompt.description.toLowerCase();

            if (lowerTitle.includes(lowerQuery)) score += 0.3;
            if (lowerDesc.includes(lowerQuery)) score += 0.2;
            
            // Cap score at 0.99 for this mock-semantic logic
            const similarity = Math.min(score, 0.99);

            return {
                ...prompt,
                similarity
            };
        });

        res.status(200).json({ status: 'success', data: resultsWithSimilarity });
        return;
    } catch (error) {
        next(error);
    }
};
