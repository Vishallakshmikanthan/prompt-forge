import prisma from '../config/prisma';

/**
 * Fetch all discussions from the database.
 */
export const getAllDiscussions = async (limit: number = 20) => {
    return prisma.discussion.findMany({
        take: limit,
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                },
            },
        },
    });
};

/**
 * Create a new discussion thread.
 */
export const createDiscussion = async (data: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    userId: string;
    tags?: string[];
}) => {
    return prisma.discussion.create({
        data: {
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            category: data.category,
            userId: data.userId,
            tags: data.tags || [],
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                },
            },
        },
    });
};
