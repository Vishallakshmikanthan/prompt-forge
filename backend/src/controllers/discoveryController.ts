import { Request, Response, NextFunction } from 'express';
import * as discoveryService from '../services/discoveryService';
import { AppError } from '../middleware/errorHandler';

export const getTrendingPrompts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const prompts = await discoveryService.getTrendingPrompts(limit);
        res.status(200).json({ status: 'success', data: prompts });
    } catch (error: any) {
        next(error);
    }
};

export const getTopPrompts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const prompts = await discoveryService.getTopPrompts(limit);
        res.status(200).json({ status: 'success', data: prompts });
    } catch (error: any) {
        next(error);
    }
};

export const getNewestPrompts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const prompts = await discoveryService.getNewestPrompts(limit);
        res.status(200).json({ status: 'success', data: prompts });
    } catch (error: any) {
        next(error);
    }
};

export const getHotPrompts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const prompts = await discoveryService.getHotPrompts(limit);
        res.status(200).json({ status: 'success', data: prompts });
    } catch (error: any) {
        next(error);
    }
};
