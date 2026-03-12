import prisma from '../config/prisma';
import { generateEmbedding, cosineSimilarity } from './embeddingService';

/**
 * Get prompts similar to a given prompt based on semantic embeddings.
 * @param promptId The ID of the prompt to find similarities for
 * @param limit Number of recommendations to return
 */
export const getSimilarPrompts = async (promptId: string, limit: number = 5) => {
    // 1. Fetch the target prompt's embedding
    const targetPrompt = await prisma.prompt.findUnique({
        where: { id: promptId },
        select: { embedding: true, category: true }
    });

    if (!targetPrompt || !targetPrompt.embedding || targetPrompt.embedding.length === 0) {
        // Fallback to category-based similarity if no embedding exists
        return prisma.prompt.findMany({
            where: {
                category: targetPrompt?.category,
                id: { not: promptId }
            },
            take: limit,
            include: {
                author: { select: { id: true, username: true, avatarUrl: true } }
            }
        });
    }

    const targetEmbedding = targetPrompt.embedding as number[];

    // 2. Fetch all other prompts with embeddings
    const otherPrompts = await prisma.prompt.findMany({
        where: {
            id: { not: promptId },
            embedding: { isEmpty: false }
        },
        include: {
            author: { select: { id: true, username: true, avatarUrl: true } }
        }
    });

    // 3. Calculate similarity and rank
    const scoredPrompts = otherPrompts.map(prompt => {
        const similarity = cosineSimilarity(targetEmbedding, prompt.embedding as number[]);
        return { ...prompt, similarity };
    });

    // 4. Return top matches
    return scoredPrompts
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
};

/**
 * Get personalized recommendations for a user.
 * logic: finds prompts similar to those the user has interacted with.
 */
export const getPersonalizedPrompts = async (userId: string, limit: number = 10) => {
    // 1. Get user interactions (bookmarks and votes)
    const [bookmarks, votes] = await Promise.all([
        prisma.bookmark.findMany({
            where: { userId },
            include: { prompt: { select: { embedding: true, id: true } } }
        }),
        prisma.vote.findMany({
            where: { userId },
            include: { prompt: { select: { embedding: true, id: true } } }
        })
    ]);

    const interactedPromptIds = new Set([
        ...bookmarks.map(b => b.promptId),
        ...votes.map(v => v.promptId)
    ]);

    const embeddings = [
        ...bookmarks.map(b => b.prompt.embedding as number[]),
        ...votes.map(v => v.prompt.embedding as number[])
    ].filter(e => e && e.length > 0);

    if (embeddings.length === 0) {
        // Fallback to trending if no user history
        const { getTrendingPrompts } = await import('./discoveryService');
        return getTrendingPrompts(limit);
    }

    // 2. Calculate an "interest vector" (average of interacted embeddings)
    const dim = embeddings[0].length;
    const interestVector = new Array(dim).fill(0);

    embeddings.forEach(vec => {
        for (let i = 0; i < dim; i++) {
            interestVector[i] += vec[i];
        }
    });

    const averagedVector = interestVector.map(val => val / embeddings.length);

    // 3. Find similar prompts excluding already interacted ones
    const candidatePrompts = await prisma.prompt.findMany({
        where: {
            id: { notIn: Array.from(interactedPromptIds) },
            embedding: { isEmpty: false }
        },
        include: {
            author: { select: { id: true, username: true, avatarUrl: true } }
        }
    });

    const recommended = candidatePrompts.map(prompt => {
        const similarity = cosineSimilarity(averagedVector, prompt.embedding as number[]);
        return { ...prompt, similarity };
    });

    return recommended
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
};
