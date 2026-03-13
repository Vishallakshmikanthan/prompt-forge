import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            res.status(400).json({ status: 'fail', message: 'Email, password, and username are required' });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({ status: 'fail', message: 'Password must be at least 8 characters' });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const data = await authService.register(email, passwordHash, username);
        res.status(201).json(data.user);
    } catch (error: any) {
        if (error.message.includes('exists')) {
            res.status(400).json({ error: "User already exists" });
            return;
        }
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user || !user.password_hash) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const data = await authService.login(email, user.password_hash);
        res.status(200).json({
            message: "Login successful",
            userId: user.id,
            token: data.token // Keeping token for existing client logic if needed
        });
    } catch (error) {
        next(error);
    }
};
