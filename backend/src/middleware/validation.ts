import { body, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

/**
 * Middleware to handle validation results.
 * If there are validation errors, it returns a 400 response.
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg).join(', ');
        const err: AppError = new Error(`Validation failed: ${errorMessages}`);
        err.statusCode = 400;
        return next(err);
    }
    next();
};

/**
 * Validation rules for creating or updating a prompt.
 */
export const promptValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title must be at most 100 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 500 }).withMessage('Description must be at most 500 characters'),
    body('promptContent')
        .trim()
        .notEmpty().withMessage('Prompt content is required'),
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required'),
    body('aiModel')
        .trim()
        .notEmpty().withMessage('AI Model is required'),
    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array'),
    validate
];

/**
 * Validation rules for user profile updates.
 */
export const userProfileValidation = [
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 300 }).withMessage('Bio must be at most 300 characters'),
    body('website')
        .optional()
        .trim()
        .isURL().withMessage('Invalid website URL'),
    body('github')
        .optional()
        .trim()
        .isURL().withMessage('Invalid GitHub URL'),
    body('twitter')
        .optional()
        .trim()
        .isURL().withMessage('Invalid Twitter URL'),
    validate
];

/**
 * Validation rules for search queries.
 */
export const searchValidation = [
    query('q')
        .trim()
        .notEmpty().withMessage('Search query is required')
        .isLength({ min: 2, max: 100 }).withMessage('Search query must be between 2 and 100 characters'),
    validate
];
