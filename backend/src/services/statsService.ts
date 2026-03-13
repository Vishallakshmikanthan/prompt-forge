import prisma from '../config/prisma';

/**
 * Get prompt counts grouped by category.
 */
export const getCategoryStats = async () => {
    const stats = await prisma.prompt.groupBy({
        by: ['category'],
        _count: {
            category: true,
        },
    });

    return stats.map((s: { category: string; _count: { category: number } }) => ({
        category: s.category,
        promptCount: s._count.category,
    }));
};

/**
 * Get community-wide statistics.
 */
export const getCommunityStats = async () => {
    const [memberCount, discussionCount, forkedPromptCount] = await Promise.all([
        prisma.user.count(),
        prisma.discussion.count(),
        prisma.promptFork.count(), // Using forks as a proxy for "Prompts Reviewed" or engagement
    ]);

    // Get trending tags from discussions
    // Fetch latest 100 discussions to find trending tags
    const recentDiscussions = await prisma.discussion.findMany({
        take: 100,
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            tags: true,
        },
    });

    const tagCounts: Record<string, number> = {};
    recentDiscussions.forEach((d: { tags: string[] }) => {
        d.tags.forEach((tag: string) => {
            const normalizedTag = tag.startsWith('#') ? tag : `#${tag}`;
            tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
        });
    });

    const trendingTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([tag, count]) => ({ tag, count }));

    return {
        members: memberCount,
        discussions: discussionCount,
        reviews: forkedPromptCount,
        trending: trendingTags,
    };
};
