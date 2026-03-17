import prisma from '../config/prisma';

export const getUserProfile = async (identifier: string) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: identifier },
                { id: identifier }
            ]
        },
        select: {
            id: true,
            username: true,
            email: true,
            reputation: true,
            bio: true,
            avatarUrl: true,
            githubUrl: true,
            website: true,
            created_at: true,
            _count: {
                select: {
                    prompts: true,
                    bookmarks: true,
                },
            },
        },
    });

    if (!user) {
        return null;
    }

    // Count prompts where this user is the author and it's a root prompt (original) vs a fork
    const promptsCreated = await prisma.prompt.count({
        where: {
            authorId: user.id,
            parentPromptId: null,
        },
    });

    const forksCreated = await prisma.prompt.count({
        where: {
            authorId: user.id,
            parentPromptId: { not: null },
        },
    });

    // Compute dynamic reputation: (likes * 5) + (forks * 10) + (views * 0.2)
    const analyticsAgg = await prisma.promptAnalytics.aggregate({
        where: { prompt: { authorId: user.id } },
        _sum: { votes: true, forks: true, views: true },
    });

    const totalLikes = analyticsAgg._sum.votes ?? 0;
    const totalForks = analyticsAgg._sum.forks ?? 0;
    const totalViews = analyticsAgg._sum.views ?? 0;
    const computedReputation = Math.floor(
        (totalLikes * 5) + (totalForks * 10) + (totalViews * 0.2)
    );

    const { created_at, ...userWithoutCreatedAt } = user;
    return {
        ...userWithoutCreatedAt,
        createdAt: created_at,
        reputation: computedReputation || user.reputation,
        stats: {
            promptsCreated,
            forksCreated,
            bookmarksSaved: user._count.bookmarks,
            totalLikes,
            totalForks,
            totalViews,
        },
    };
};

export const getUserPrompts = async (identifier: string) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: identifier },
                { id: identifier }
            ]
        }
    });
    if (!user) return [];

    return prisma.prompt.findMany({
        where: {
            authorId: user.id,
            parentPromptId: null,
        },
        include: {
            author: {
                select: { username: true, avatarUrl: true },
            },
            _count: {
                select: { votes: true, bookmarks: true, forkedPrompts: true, versions: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};

export const getUserForks = async (identifier: string) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: identifier },
                { id: identifier }
            ]
        }
    });
    if (!user) return [];

    return prisma.prompt.findMany({
        where: {
            authorId: user.id,
            parentPromptId: { not: null },
        },
        include: {
            author: {
                select: { username: true, avatarUrl: true },
            },
            parentPrompt: {
                select: { title: true, author: { select: { username: true } } },
            },
            _count: {
                select: { votes: true, bookmarks: true, forkedPrompts: true, versions: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};

export const getUserBookmarks = async (identifier: string) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: identifier },
                { id: identifier }
            ]
        }
    });
    if (!user) return [];

    const bookmarks = await prisma.bookmark.findMany({
        where: { userId: user.id },
        include: {
            prompt: {
                include: {
                    author: {
                        select: { username: true, avatarUrl: true },
                    },
                    _count: {
                        select: { votes: true, bookmarks: true, forkedPrompts: true, versions: true },
                    },
                },
            },
        },
        orderBy: { prompt: { createdAt: 'desc' } },
    });

    return bookmarks.map((b: any) => b.prompt);
};

export const getLeaderboard = async (limit: number = 10) => {
    return prisma.user.findMany({
        take: limit,
        orderBy: {
            reputation: 'desc',
        },
        select: {
            id: true,
            username: true,
            avatarUrl: true,
            reputation: true,
            _count: {
                select: {
                    prompts: true,
                },
            },
        },
    });
};

export const upsertUser = async (data: { id: string; username: string; email: string; avatarUrl?: string }) => {
    return prisma.user.upsert({
        where: { id: data.id },
        update: {
            username: data.username,
            email: data.email,
            avatarUrl: data.avatarUrl,
        },
        create: {
            id: data.id,
            username: data.username,
            email: data.email,
            avatarUrl: data.avatarUrl,
        },
    });
};

export const updateProfile = async (
    userId: string,
    data: {
        username?: string;
        displayName?: string;
        bio?: string;
        website?: string;
        location?: string;
        skills?: any;
    }
) => {
    if (data.username) {
        const existing = await prisma.user.findFirst({
            where: {
                username: data.username,
                id: { not: userId }
            }
        });
        if (existing) {
            throw new Error('Username is already taken');
        }
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            username: true,
            email: true,
            displayName: true,
            bio: true,
            website: true,
            location: true,
            skills: true,
            avatarUrl: true,
            created_at: true,
        }
    });

    const { created_at, ...updatedWithoutCreatedAt } = updated;
    return {
        ...updatedWithoutCreatedAt,
        createdAt: created_at,
    };
};

// ─── Extended Profile Analytics ─────────────────────────────────────────────

/**
 * Activity graph — returns prompt creation count per day for the last year.
 */
export const getActivityGraph = async (identifier: string) => {
    const user = await prisma.user.findFirst({
        where: { OR: [{ username: identifier }, { id: identifier }] },
    });
    if (!user) return { days: [], totalContributions: 0 };

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const prompts = await prisma.prompt.findMany({
        where: {
            authorId: user.id,
            createdAt: { gte: oneYearAgo },
        },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
    });

    // Group by date string
    const map: Record<string, number> = {};
    prompts.forEach((p: any) => {
        const day = p.createdAt.toISOString().slice(0, 10);
        map[day] = (map[day] || 0) + 1;
    });

    // Build 365-day array
    const days: { day: string; count: number }[] = [];
    const now = new Date();
    for (let i = 364; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        days.push({ day: key, count: map[key] || 0 });
    }

    const totalContributions = prompts.length;
    return { days, totalContributions };
};

/**
 * Analytics charts — monthly aggregated views, votes, forks for the user's prompts.
 */
export const getAnalytics = async (identifier: string) => {
    const user = await prisma.user.findFirst({
        where: { OR: [{ username: identifier }, { id: identifier }] },
    });
    if (!user) return [];

    const promptsWithAnalytics = await prisma.prompt.findMany({
        where: { authorId: user.id },
        select: {
            createdAt: true,
            analytics: {
                select: { views: true, votes: true, forks: true, bookmarks: true },
            },
        },
        orderBy: { createdAt: 'asc' },
    });

    // Aggregate by month
    const months: Record<string, { views: number; usage: number; forks: number }> = {};
    promptsWithAnalytics.forEach((p: any) => {
        const month = p.createdAt.toISOString().slice(0, 7); // YYYY-MM
        if (!months[month]) months[month] = { views: 0, usage: 0, forks: 0 };
        if (p.analytics) {
            months[month].views += p.analytics.views;
            months[month].usage += p.analytics.views; // usage ≈ views
            months[month].forks += p.analytics.forks;
        }
    });

    const chartData = Object.entries(months).map(([name, vals]) => ({
        name,
        views: vals.views,
        usage: vals.usage,
        forks: vals.forks,
    }));

    return chartData;
};

/**
 * Featured prompt — the user's top-rated prompt (highest score).
 */
export const getFeaturedPrompt = async (identifier: string) => {
    const user = await prisma.user.findFirst({
        where: { OR: [{ username: identifier }, { id: identifier }] },
    });
    if (!user) return null;

    const prompt = await prisma.prompt.findFirst({
        where: { authorId: user.id },
        orderBy: { score: 'desc' },
        include: {
            analytics: true,
            _count: { select: { votes: true, forkedPrompts: true, bookmarks: true } },
        },
    });

    if (!prompt) return null;

    return {
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        category: prompt.category,
        tags: prompt.tags,
        score: prompt.score,
        forks: prompt._count.forkedPrompts,
        likes: prompt._count.votes,
        views: prompt.analytics?.views ?? 0,
    };
};

/**
 * Collections — group the user's prompts by category with count.
 */
export const getCollections = async (identifier: string) => {
    const user = await prisma.user.findFirst({
        where: { OR: [{ username: identifier }, { id: identifier }] },
    });
    if (!user) return [];

    const groups = await prisma.prompt.groupBy({
        by: ['category'],
        where: { authorId: user.id },
        _count: { _all: true },
        orderBy: { _count: { category: 'desc' } },
    });

    return groups.map((g: any) => ({
        title: g.category,
        count: g._count._all,
    }));
};

/**
 * Activity timeline — recent actions (prompt creates, forks) in chronological order.
 */
export const getActivityTimeline = async (identifier: string) => {
    const user = await prisma.user.findFirst({
        where: { OR: [{ username: identifier }, { id: identifier }] },
    });
    if (!user) return [];

    // Original prompts created
    const created = await prisma.prompt.findMany({
        where: { authorId: user.id, parentPromptId: null },
        select: { title: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
    });

    // Forks created
    const forked = await prisma.prompt.findMany({
        where: { authorId: user.id, parentPromptId: { not: null } },
        select: {
            title: true,
            createdAt: true,
            parentPrompt: { select: { title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
    });

    // Votes cast
    const votes = await prisma.vote.findMany({
        where: { userId: user.id },
        select: {
            voteType: true,
            prompt: { select: { title: true } },
        },
        orderBy: { promptId: 'desc' },
        take: 5,
    });

    // Combine and sort
    const events: { type: string; content: string; timestamp: string }[] = [];

    created.forEach((p: any) => {
        events.push({
            type: 'create',
            content: `Created prompt: ${p.title}`,
            timestamp: p.createdAt.toISOString(),
        });
    });

    forked.forEach((p: any) => {
        events.push({
            type: 'fork',
            content: `Forked prompt: ${p.parentPrompt?.title || p.title}`,
            timestamp: p.createdAt.toISOString(),
        });
    });

    votes.forEach((v: any) => {
        events.push({
            type: 'like',
            content: `${v.voteType === 'UP' ? 'Liked' : 'Voted on'} prompt: ${v.prompt.title}`,
            timestamp: new Date().toISOString(),
        });
    });

    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return events.slice(0, 20);
};

// ── Follow system ─────────────────────────────────────────────────────────────

export const toggleFollow = async (followerId: string, followingId: string) => {
    const existing = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId, followingId } },
    });

    if (existing) {
        await prisma.follow.delete({
            where: { followerId_followingId: { followerId, followingId } },
        });
        const followerCount = await prisma.follow.count({ where: { followingId } });
        return { following: false, followerCount };
    }

    await prisma.follow.create({ data: { followerId, followingId } });
    const followerCount = await prisma.follow.count({ where: { followingId } });
    return { following: true, followerCount };
};

export const getFollowStatus = async (currentUserId: string | undefined, targetUserId: string) => {
    const followerCount = await prisma.follow.count({ where: { followingId: targetUserId } });
    const followingCount = await prisma.follow.count({ where: { followerId: targetUserId } });

    let following = false;
    if (currentUserId) {
        const record = await prisma.follow.findUnique({
            where: { followerId_followingId: { followerId: currentUserId, followingId: targetUserId } },
        });
        following = !!record;
    }

    return { following, followerCount, followingCount };
};

// ── Activity feed ─────────────────────────────────────────────────────────────

export const getFeed = async (userId: string, limit: number, offset: number) => {
    const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
    });

    const followingIds = following.map((f: { followingId: string }) => f.followingId);

    if (followingIds.length === 0) {
        return { prompts: [], total: 0, hasMore: false };
    }

    const [prompts, total] = await Promise.all([
        prisma.prompt.findMany({
            where: { authorId: { in: followingIds } },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                aiModel: true,
                tags: true,
                score: true,
                createdAt: true,
                author: { select: { username: true, avatarUrl: true } },
                _count: { select: { votes: true, bookmarks: true, forkedPrompts: true } },
            },
        }),
        prisma.prompt.count({ where: { authorId: { in: followingIds } } }),
    ]);

    return { prompts, total, hasMore: offset + limit < total };
};

// ── Update public profile ─────────────────────────────────────────────────────

export const updatePublicProfile = async (
    userId: string,
    data: { bio?: string; twitterUrl?: string; githubUrl?: string; website?: string }
) => {
    const updated = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(data.bio !== undefined && { bio: data.bio }),
            ...(data.twitterUrl !== undefined && { twitterUrl: data.twitterUrl }),
            ...(data.githubUrl !== undefined && { githubUrl: data.githubUrl }),
            ...(data.website !== undefined && { website: data.website }),
        },
        select: {
            id: true, username: true, bio: true,
            twitterUrl: true, githubUrl: true, website: true,
        },
    });
    return updated;
};
