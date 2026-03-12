import { fetchApi } from "../api";

export interface Notification {
    id: string;
    userId: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export const notificationService = {
    /**
     * Fetch all notifications for the current user.
     * Endpoint: GET /notifications
     */
    async getUserNotifications(userId: string): Promise<Notification[]> {
        return fetchApi<Notification[]>(`/notifications?userId=${userId}`);
    },

    /**
     * Mark a specific notification as read.
     * Endpoint: PATCH /notifications/:id/read
     */
    async markAsRead(id: string): Promise<Notification> {
        return fetchApi<Notification>(`/notifications/${id}/read`, {
            method: "PATCH"
        });
    },
};
