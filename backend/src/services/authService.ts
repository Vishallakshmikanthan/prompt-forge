import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

export const register = async (email: string, passwordHash: string, username: string, authProvider: string = 'email') => {
    // Generate dicebear identicon avatar
    const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`;

    // Check if user exists
    const existing = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    });

    if (existing) {
        throw new Error('User with email or username already exists');
    }

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            username,
            avatarUrl,
            authProvider,
            displayName: username
        }
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Exclude passwordHash from response
    const { passwordHash: _hash, ...safeUser } = user;
    return { user: safeUser, token };
};

export const login = async (email: string, passwordHash: string) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    if (user.authProvider !== 'email' || !user.passwordHash) {
        throw new Error('Please login with your social provider');
    }

    const { passwordHash: _hash, ...safeUser } = user;
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return { user: safeUser, token };
};
