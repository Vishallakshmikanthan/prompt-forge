import prisma from '../config/prisma';

/**
 * Ensures that an analytics record exists for a given prompt.
 * If not, creates one.
 */
const ensureAnalyticsExists = async (promptId: string) => {
    return prisma.promptAnalytics.upsert({
        where: { promptId },
        update: {},
        create: { promptId },
    });
};

/**
 * Increment view count for a prompt.
 */
export const incrementPromptView = async (promptId: string) => {
    await ensureAnalyticsExists(promptId);
    return prisma.promptAnalytics.update({
        where: { promptId },
        data: {
            views: {
                increment: 1,
            },
        },
    });
};

/**
 * Increment vote count for a prompt.
 */
export const incrementVoteCount = async (promptId: string) => {
    await ensureAnalyticsExists(promptId);
    return prisma.promptAnalytics.update({
        where: { promptId },
        data: {
            votes: {
                increment: 1,
            },
        },
    });
};

/**
 * Increment fork count for a prompt.
 */
export const incrementForkCount = async (promptId: string) => {
    await ensureAnalyticsExists(promptId);
    return prisma.promptAnalytics.update({
        where: { promptId },
        data: {
            forks: {
                increment: 1,
            },
        },
    });
};

/**
 * Increment bookmark count for a prompt.
 */
export const incrementBookmarkCount = async (promptId: string) => {
    await ensureAnalyticsExists(promptId);
    return prisma.promptAnalytics.update({
        where: { promptId },
        data: {
            bookmarks: {
                increment: 1,
            },
        },
    });
};

/**
 * Retrieve analytics for a specific prompt.
 */
export const getPromptAnalytics = async (promptId: string) => {
    const analytics = await prisma.promptAnalytics.findUnique({
        where: { promptId },
    });

    if (!analytics) {
        return {
            promptId,
            views: 0,
            votes: 0,
            forks: 0,
            bookmarks: 0,
            updatedAt: new Date(),
        };
    }

    return analytics;
};
