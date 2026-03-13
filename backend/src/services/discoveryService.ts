import prisma from '../config/prisma';

/**
 * Trending Ranking Logic:
 * score = (likes * 3) + (forks * 4) + (views * 0.5)
 */

export const getTrendingPrompts = async (limit: number = 12) => {
    // We use queryRaw to implement the specific scoring formula efficiently in the DB
    const prompts = await prisma.$queryRaw`
        SELECT p.*, 
               u.username as "authorUsername",
               u.email as "authorEmail",
               u."avatarUrl" as "authorAvatar",
               COALESCE(pa.views, 0) as views,
               COALESCE(pa.votes, 0) as likes,
               COALESCE(pa.forks, 0) as forks,
               (COALESCE(pa.votes, 0) * 3 + COALESCE(pa.forks, 0) * 4 + COALESCE(pa.views, 0) * 0.5) AS trending_score
        FROM "Prompt" p
        LEFT JOIN "users" u ON p."authorId" = u.id
        LEFT JOIN "PromptAnalytics" pa ON p.id = pa."promptId"
        WHERE p."moderationStatus" = 'approved'
        ORDER BY trending_score DESC
        LIMIT ${limit}
    `;

    // Map the raw results to match the expected Prompt interface
    return (prompts as any[]).map(p => ({
        ...p,
        author: {
            id: p.authorId,
            username: p.username || p.authorUsername,
            email: p.email || p.authorEmail,
            avatarUrl: p.avatarUrl || p.authorAvatar
        },
        analytics: {
            views: p.views,
            votes: p.likes,
            forks: p.forks
        },
        _count: {
            votes: p.likes,
            forkedPrompts: p.forks,
            bookmarks: 0
        }
    }));
};

export const getTopPrompts = async (limit: number = 12) => {
    return getPopularPrompts(limit);
};

export const getPopularPrompts = async (limit: number = 12) => {
    return prisma.prompt.findMany({
        take: limit,
        where: { moderationStatus: 'approved' },
        orderBy: {
            score: 'desc', 
        },
        include: {
            author: {
                select: { id: true, username: true, email: true, avatarUrl: true },
            },
            analytics: true,
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

export const getNewestPrompts = async (limit: number = 12) => {
    return prisma.prompt.findMany({
        take: limit,
        where: { moderationStatus: 'approved' },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            author: {
                select: { id: true, username: true, email: true, avatarUrl: true },
            },
            analytics: true,
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
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return prisma.prompt.findMany({
        where: {
            moderationStatus: 'approved',
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
                select: { id: true, username: true, email: true, avatarUrl: true },
            },
            analytics: true,
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
