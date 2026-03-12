import prisma from '../config/prisma';

export interface CreateNotificationInput {
    userId: string;
    type: string;
    message: string;
}

export const createNotification = async (data: CreateNotificationInput) => {
    return prisma.notification.create({
        data: {
            userId: data.userId,
            type: data.type,
            message: data.message,
        },
    });
};

export const getUserNotifications = async (userId: string) => {
    return prisma.notification.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const markNotificationRead = async (id: string, userId: string) => {
    // Ensure that only the owner can mark the notification as read
    return prisma.notification.updateMany({
        where: {
            id,
            userId,
        },
        data: {
            read: true,
        },
    });
};

