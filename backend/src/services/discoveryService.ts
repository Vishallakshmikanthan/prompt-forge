import prisma from '../config/prisma';

/**
 * Trending Ranking Logic:
 * score = (vote_count * 2) + (fork_count * 3) + (bookmark_count * 1.5) + recency_boost
 */

export const getTrendingPrompts = async (limit: number = 10) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const prompts = await prisma.prompt.findMany({
        where: {
            moderationStatus: 'approved',
            createdAt: {
                gte: thirtyDaysAgo,
            },
        },
        include: {
            author: {
                select: { id: true, username: true, email: true },
            },
            _count: {
                select: {
                    votes: true,
                    forkedPrompts: true,
                    bookmarks: true,
                },
            },
        },
    });

    // Calculate scores and sort in memory for simplicity of the formula logic
    // In a real large-scale app, this would be a raw query or materialized view
    const rankedPrompts = prompts.map((prompt: any) => {
        const voteCount = prompt._count.votes;
        const forkCount = prompt._count.forkedPrompts;
        const bookmarkCount = prompt._count.bookmarks;

        // Recency boost: 100 points if created in the last 24 hours, 50 if last 3 days
        const now = new Date();
        const hoursSinceCreation = (now.getTime() - prompt.createdAt.getTime()) / (1000 * 60 * 60);
        let recencyBoost = 0;
        if (hoursSinceCreation <= 24) {
            recencyBoost = 100;
        } else if (hoursSinceCreation <= 72) {
            recencyBoost = 50;
        }

        const trendingScore = (voteCount * 2) + (forkCount * 3) + (bookmarkCount * 1.5) + recencyBoost;

        return { ...prompt, trendingScore };
    });

    return rankedPrompts.sort((a: any, b: any) => b.trendingScore - a.trendingScore).slice(0, limit);
};

export const getTopPrompts = async (limit: number = 10) => {
    return prisma.prompt.findMany({
        take: limit,
        orderBy: {
            score: 'desc',
        },
        include: {
            author: {
                select: { id: true, username: true, email: true },
            },
            _count: {
                select: {
                    votes: true,
                    forkedPrompts: true,
                    bookmarks: true,
                },
            },
        },
    });
};

export const getNewestPrompts = async (limit: number = 10) => {
    return prisma.prompt.findMany({
        take: limit,
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            author: {
                select: { id: true, username: true, email: true },
            },
            _count: {
                select: {
                    votes: true,
                    forkedPrompts: true,
                    bookmarks: true,
                },
            },
        },
    });
};

export const getHotPrompts = async (limit: number = 10) => {
    // Hot prompts can be defined as recently highly voted prompts
    // For now, let's use a similar logic to trending but with a focus on recent votes if we had vote timestamps.
    // Since we don't have vote timestamps in the Vote model, we'll use a subset of trending or just top within a recency window.

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return prisma.prompt.findMany({
        where: {
            createdAt: {
                gte: oneWeekAgo
            }
        },
        take: limit,
        orderBy: {
            score: 'desc'
        },
        include: {
            author: {
                select: { id: true, username: true, email: true },
            },
            _count: {
                select: {
                    votes: true,
                    forkedPrompts: true,
                    bookmarks: true,
                },
            },
        }
    });
};
