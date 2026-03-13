import { fetchApi } from "../api";

export interface DiscussionThread {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    userId: string;
    user: {
        id: string;
        username: string;
        avatarUrl?: string;
    };
    upvotes: number;
    comments: number;
    trending: boolean;
    createdAt: string;
}

export const discussionService = {
    /**
     * Fetch all discussion threads.
     */
    async getAllDiscussions(limit: number = 20): Promise<DiscussionThread[]> {
        return fetchApi<DiscussionThread[]>(`/discussions?limit=${limit}`);
    },

    /**
     * Create a new discussion thread.
     */
    async createDiscussion(data: {
        title: string;
        content: string;
        category: string;
        userId: string;
        tags?: string[];
    }): Promise<DiscussionThread> {
        return fetchApi<DiscussionThread>("/discussions", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },
};
