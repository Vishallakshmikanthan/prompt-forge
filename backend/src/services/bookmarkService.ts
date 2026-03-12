import prisma from '../config/prisma';
import * as notificationService from './notificationService';
import * as analyticsService from './analyticsService';

/**
 * Add a bookmark for a user.
 */
export const addBookmark = async (userId: string, promptId: string) => {
    const result = await prisma.$transaction(async (tx: any) => {
        const existing = await tx.bookmark.findFirst({
            where: { userId, promptId },
        });

        if (existing) {
            throw new Error('Prompt already bookmarked');
        }

        // 1. Create the bookmark
        const bookmark = await tx.bookmark.create({
            data: {
                userId,
                promptId,
            },
        });

        // 2. Award reputation (+5) to author
        const prompt = await tx.prompt.findUnique({
            where: { id: promptId },
            select: { authorId: true },
        });

        if (prompt) {
            await tx.user.update({
                where: { id: prompt.authorId },
                data: {
                    reputation: {
                        increment: 5,
                    },
                },
            });
        }

        return { bookmark, authorId: prompt?.authorId };
    });

    // Track analytics (bookmark)
    await analyticsService.incrementBookmarkCount(promptId);

    // Notify the prompt author that their prompt was bookmarked
    if (result.authorId && result.authorId !== userId) {
        await notificationService.createNotification({
            userId: result.authorId,
            type: 'PROMPT_BOOKMARKED',
            message: 'Your prompt was bookmarked.',
        });
    }

    return result.bookmark;
};

/**
 * Remove a bookmark for a user.
 */
export const removeBookmark = async (userId: string, promptId: string) => {
    return prisma.bookmark.deleteMany({
        where: {
            userId,
            promptId,
        },
    });
};

/**
 * Get all bookmarks for a user, including prompt data.
 */
export const getUserBookmarks = async (userId: string) => {
    return prisma.bookmark.findMany({
        where: { userId },
        include: {
            prompt: {
                include: {
                    author: {
                        select: { id: true, username: true, email: true },
                    },
                },
            },
        },
        orderBy: {
            id: 'desc', // Assuming higher ID means more recent, or use createdAt if added
        },
    });
};

/**
 * Check if a bookmark exists.
 */
export const getBookmark = async (userId: string, promptId: string) => {
    return prisma.bookmark.findFirst({
        where: {
            userId,
            promptId,
        },
    });
};
