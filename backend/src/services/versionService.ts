import prisma from '../config/prisma';

/**
 * Fetches all versions for a specific prompt, ordered by version number descending.
 */
export const getVersionsByPromptId = async (promptId: string) => {
    return prisma.promptVersion.findMany({
        where: { promptId },
        orderBy: { versionNumber: 'desc' },
    });
};

/**
 * Records a new version for a prompt.
 */
export const createVersion = async (promptId: string, content: string, versionNumber: number) => {
    return prisma.promptVersion.create({
        data: {
            promptId,
            promptContent: content,
            versionNumber,
        },
    });
};

/**
 * Gets the latest version number for a prompt.
 */
export const getLatestVersionNumber = async (promptId: string) => {
    const latest = await prisma.promptVersion.findFirst({
        where: { promptId },
        orderBy: { versionNumber: 'desc' },
        select: { versionNumber: true },
    });
    return latest?.versionNumber || 0;
};
