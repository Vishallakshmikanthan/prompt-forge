import { Request, Response, NextFunction } from 'express';
import * as versionService from '../services/versionService';
import { AppError } from '../middleware/errorHandler';
import prisma from '../config/prisma';

/**
 * GET /api/prompts/:id/versions
 * Retrieve all historical versions of a prompt.
 */
export const getPromptVersions = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const promptId = req.params['id'] as string;
        const versions = await versionService.getVersionsByPromptId(promptId);

        res.status(200).json({
            status: 'success',
            data: versions,
        });
    } catch (err: any) {
        next(err as AppError);
    }
};

/**
 * PATCH /api/prompts/:id/versions/:versionId/restore
 * Restore a prompt to the content of the specified version.
 * Only the prompt owner may perform this action.
 */
export const restoreVersion = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const promptId = req.params['id'] as string;
        const versionId = req.params['versionId'] as string;
        const requestingUserId = (req as any).user?.id;

        if (!requestingUserId) {
            const err: AppError = new Error('Authentication required');
            err.statusCode = 401;
            return next(err);
        }

        // Verify prompt exists and requesting user is the owner
        const prompt = await prisma.prompt.findUnique({ where: { id: promptId } });
        if (!prompt) {
            const err: AppError = new Error('Prompt not found');
            err.statusCode = 404;
            return next(err);
        }
        if (prompt.authorId !== requestingUserId) {
            const err: AppError = new Error('You are not authorized to restore versions of this prompt');
            err.statusCode = 403;
            return next(err);
        }

        // Fetch the requested version (must belong to this prompt)
        const version = await prisma.promptVersion.findFirst({
            where: { id: versionId, promptId },
        });
        if (!version) {
            const err: AppError = new Error('Version not found');
            err.statusCode = 404;
            return next(err);
        }

        // Determine next version number for the restore record
        const nextVersionNumber = await versionService.getLatestVersionNumber(promptId) + 1;

        // Update prompt content and record the restore as a new version in a transaction
        const updatedPrompt = await prisma.$transaction(async (tx: any) => {
            const restored = await tx.prompt.update({
                where: { id: promptId },
                data: { promptContent: version.promptContent },
                include: {
                    author: { select: { id: true, username: true, email: true } },
                },
            });

            await tx.promptVersion.create({
                data: {
                    promptId,
                    promptContent: version.promptContent,
                    versionNumber: nextVersionNumber,
                },
            });

            return restored;
        });

        res.status(200).json({
            status: 'success',
            data: updatedPrompt,
        });
    } catch (err: any) {
        next(err as AppError);
    }
};
