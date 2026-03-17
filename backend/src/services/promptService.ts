import prisma from '../config/prisma';
import { generateEmbedding } from './embeddingService';
import * as moderationService from './moderationService';
import * as notificationService from './notificationService';
import * as analyticsService from './analyticsService';

export interface CreatePromptInput {
    title: string;
    description: string;
    promptContent: string;
    category: string;
    aiModel: string;
    tags?: string[];
    authorId: string;
    parentPromptId?: string;
    embedding?: number[];
    qualityScore?: number;
    moderationStatus?: string;
}

export interface UpdatePromptInput {
    title?: string;
    description?: string;
    promptContent?: string;
    category?: string;
    aiModel?: string;
    tags?: string[];
    embedding?: number[];
}

/**
 * Retrieve all prompts from the database, including author info.
 * Supports cursor-based pagination and category filtering.
 */
export const getAllPrompts = async (limit: number = 20, cursor?: string, category?: string) => {
    return prisma.prompt.findMany({
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
            moderationStatus: 'approved',
            category: category ? { equals: category, mode: 'insensitive' } : undefined,
        },
        include: {
            author: {
                select: { id: true, username: true, email: true },
            },
            parentPrompt: {
                select: { id: true, title: true },
            },
            _count: {
                select: { forkedPrompts: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};

/**
 * Retrieve a single prompt by its ID.
 */
export const getPromptById = async (id: string) => {
    return prisma.prompt.findUnique({
        where: { id },
        include: {
            author: {
                select: { id: true, username: true, email: true },
            },
            parentPrompt: {
                select: { id: true, title: true },
            },
            versions: true,
            _count: {
                select: { forkedPrompts: true },
            },
        },
    });
};

/**
 * Create a new prompt in the database.
 * Includes AI moderation and quality scoring before insertion.
 */
export const createPrompt = async (data: CreatePromptInput) => {
    // 1. Analyze for safety/injection
    const moderation = await moderationService.analyzePromptContent(data.promptContent);

    // 2. Calculate quality score
    const quality = await moderationService.calculateQualityScore(data.promptContent);

    // 3. Determine status (threshold of 60)
    let moderationStatus = moderation.isSafe ? 'approved' : 'flagged';
    if (moderationStatus === 'approved' && quality.score < 60) {
        moderationStatus = 'flagged';
    }

    // Generate embedding automatically from prompt content
    const embedding = await generateEmbedding(`${data.title} ${data.description} ${data.promptContent}`);

    return prisma.prompt.create({
        data: {
            title: data.title,
            description: data.description,
            promptContent: data.promptContent,
            category: data.category,
            aiModel: data.aiModel,
            tags: data.tags ?? [],
            authorId: data.authorId,
            parentPromptId: data.parentPromptId,
            embedding: embedding,
            qualityScore: quality.score,
            moderationStatus: moderationStatus,
        },
        include: {
            author: {
                select: { id: true, username: true, email: true },
            },
            parentPrompt: {
                select: { id: true, title: true },
            },
        },
    });
};
/**
 * Vote for a prompt and update its score.
 */
export const votePrompt = async (promptId: string, userId: string, voteType: 'upvote') => {
    const result = await prisma.$transaction(async (tx: any) => {
        // 1. Check if user already voted
        const existingVote = await tx.vote.findFirst({
            where: {
                promptId,
                userId,
            },
        });

        if (existingVote) {
            throw new Error('User has already voted for this prompt');
        }

        // 2. Create the vote record
        const vote = await tx.vote.create({
            data: {
                promptId,
                userId,
                voteType,
            },
        });

        // 3. Update the prompt score and award reputation (+10) to author
        const updatedPrompt = await tx.prompt.update({
            where: { id: promptId },
            data: {
                score: {
                    increment: 1,
                },
                author: {
                    update: {
                        reputation: {
                            increment: 10,
                        },
                    },
                },
            },
        });

        return { vote, updatedPrompt };
    });

    // Track analytics (vote)
    await analyticsService.incrementVoteCount(promptId);

    // Create a notification for the prompt author when their prompt is upvoted
    const authorId = result.updatedPrompt.authorId;
    if (authorId && authorId !== userId) {
        await notificationService.createNotification({
            userId: authorId,
            type: 'PROMPT_UPVOTED',
            message: 'Your prompt received a new upvote.',
        });
    }

    return result;
};

/**
 * Delete a prompt owned by the requesting user.
 * Nullifies parentPromptId on child forks before deletion so FK constraints are not violated
 * (the self-referential PromptLineage relation has no cascade). All other related records
 * (PromptAnalytics, PromptVersion, Vote, Bookmark, PromptFork) carry onDelete: Cascade.
 */
export const deletePrompt = async (promptId: string, requestingUserId: string) => {
    return prisma.$transaction(async (tx: any) => {
        const prompt = await tx.prompt.findUnique({ where: { id: promptId } });

        if (!prompt) {
            const err: any = new Error('Prompt not found');
            err.statusCode = 404;
            throw err;
        }

        if (prompt.authorId !== requestingUserId) {
            const err: any = new Error('You are not authorized to delete this prompt');
            err.statusCode = 403;
            throw err;
        }

        // Nullify parentPromptId on any forks so the self-referential FK does not block deletion
        await tx.prompt.updateMany({
            where: { parentPromptId: promptId },
            data: { parentPromptId: null },
        });

        await tx.prompt.delete({ where: { id: promptId } });
    });
};

/**
 * Update a prompt and automatically record a version of the PREVIOUS content.
 */
export const updatePrompt = async (id: string, data: UpdatePromptInput) => {
    return prisma.$transaction(async (tx: any) => {
        // 1. Fetch current prompt to get the content to be archived
        const current = await tx.prompt.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { versions: true },
                },
            },
        });

        if (!current) {
            throw new Error('Prompt not found');
        }

        // 2. Create a version record for the content that is about to be replaced
        await tx.promptVersion.create({
            data: {
                promptId: id,
                promptContent: current.promptContent,
                versionNumber: current._count.versions + 1,
            },
        });

        // 3. Generate new embedding if content/title/desc changed
        const newTitle = data.title ?? current.title;
        const newDesc = data.description ?? current.description;
        const newContent = data.promptContent ?? current.promptContent;

        const embedding = await generateEmbedding(`${newTitle} ${newDesc} ${newContent}`);

        // 4. Update the main prompt
        return tx.prompt.update({
            where: { id },
            data: {
                title: newTitle,
                description: newDesc,
                promptContent: newContent,
                category: data.category ?? current.category,
                aiModel: data.aiModel ?? current.aiModel,
                tags: data.tags ?? current.tags,
                embedding: embedding,
            },
        });
    });
};

