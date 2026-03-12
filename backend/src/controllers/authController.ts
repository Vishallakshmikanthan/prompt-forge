import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            res.status(400).json({ status: 'fail', message: 'Email, password, and username are required' });
            return;
        }

        if (password.length < 8 || !/\d/.test(password)) {
            res.status(400).json({ status: 'fail', message: 'Password must be at least 8 characters and contain a number' });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const data = await authService.register(email, passwordHash, username);
        res.status(201).json({ status: 'success', data });
    } catch (error: any) {
        error.statusCode = error.message.includes('exists') ? 409 : 500;
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ status: 'fail', message: 'Email and password are required' });
            return;
        }

        // We fetch user first to check password
        import('../config/prisma').then(async ({ default: prisma }) => {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user || !user.passwordHash) {
                res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
                return;
            }

            const valid = await bcrypt.compare(password, user.passwordHash);
            if (!valid) {
                res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
                return;
            }

            const data = await authService.login(email, user.passwordHash);
            res.status(200).json({ status: 'success', data });
        }).catch(next);
    } catch (error) {
        next(error);
    }
};
