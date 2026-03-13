import prisma from '../config/prisma';
import * as notificationService from './notificationService';
import * as analyticsService from './analyticsService';

/**
 * Creates a fork of an existing prompt.
 */
export const createFork = async (userId: string, originalPromptId: string) => {
    const forkedPrompt = await prisma.$transaction(async (tx: any) => {
        // 1. Fetch original prompt
        const original = await tx.prompt.findUnique({
            where: { id: originalPromptId },
        });

        if (!original) {
            throw new Error('Original prompt not found');
        }

        // 2. Prevent self-forking and award reputation (+20) to original author
        if (original.authorId === userId) {
            throw new Error('You cannot fork your own prompt');
        }

        await tx.user.update({
            where: { id: original.authorId },
            data: {
                reputation: {
                    increment: 20,
                },
            },
        });

        // 3. Create the forked prompt
        // Note: We copy most fields, but reset score and safetyStatus
        const createdFork = await tx.prompt.create({
            data: {
                title: `${original.title} (Fork)`,
                description: original.description,
                promptContent: original.promptContent,
                category: original.category,
                aiModel: original.aiModel,
                tags: original.tags,
                authorId: userId,
                parentPromptId: original.id,
            },
        });

        // 4. Record the fork event in the dedicated tracking table
        await tx.promptFork.create({
            data: {
                promptId: original.id,
                userId: userId,
            },
        });

        return { createdFork, originalAuthorId: original.authorId };
    });

    // Track analytics (fork)
    await analyticsService.incrementForkCount(originalPromptId);

    // Notify the original prompt author about the fork (but not on self-fork, which is disallowed)
    if (forkedPrompt.originalAuthorId && forkedPrompt.originalAuthorId !== userId) {
        await notificationService.createNotification({
            userId: forkedPrompt.originalAuthorId,
            type: 'PROMPT_FORKED',
            message: 'Someone forked your prompt.',
        });
    }

    return forkedPrompt.createdFork;
};

/**
 * Get the number of forks for a specific prompt.
 */
export const getForkCount = async (promptId: string) => {
    return prisma.prompt.count({
        where: { parentPromptId: promptId },
    });
};
