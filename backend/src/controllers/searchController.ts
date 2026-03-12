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

        // 1. Generate embedding for the search query
        const queryEmbedding = await generateEmbedding(query);

        // 2. Fetch all prompts that have embeddings
        // In a large production app, we would use pgvector and index-base search in the DB
        const prompts = await prisma.prompt.findMany({
            where: {
                embedding: {
                    isEmpty: false
                }
            },
            include: {
                author: {
                    select: { id: true, username: true, avatarUrl: true }
                }
            }
        });

        // 3. Compute similarities and rank
        const scoredResults = prompts.map(prompt => {
            const similarity = cosineSimilarity(queryEmbedding, prompt.embedding as number[]);
            return {
                ...prompt,
                similarity
            };
        });

        // 4. Sort by similarity and return top matches
        // We filter by a minimum similarity threshold to ensure quality
        const THRESHOLD = 0.5;
        const results = scoredResults
            .filter(p => p.similarity >= THRESHOLD)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 20); // Return top 20

        res.status(200).json({ status: 'success', data: results });
        return;
    } catch (error) {
        next(error);
    }
};
