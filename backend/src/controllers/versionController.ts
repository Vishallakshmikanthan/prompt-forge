import { Request, Response, NextFunction } from 'express';
import * as versionService from '../services/versionService';
import { AppError } from '../middleware/errorHandler';

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
