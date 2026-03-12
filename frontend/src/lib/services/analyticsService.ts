import { fetchApi } from "../api";

export interface PromptAnalytics {
    id: string;
    promptId: string;
    views: number;
    votes: number;
    forks: number;
    bookmarks: number;
    updatedAt: string;
}

export const analyticsService = {
    /**
     * Increment view count for a prompt.
     * Endpoint: POST /prompts/:id/view
     */
    async trackPromptView(id: string): Promise<{ message: string }> {
        return fetchApi<{ message: string }>(`/prompts/${id}/view`, {
            method: "POST",
        });
    },

    /**
     * Retrieve analytics for a specific prompt.
     * Endpoint: GET /prompts/:id/analytics
     */
    async getPromptAnalytics(id: string): Promise<PromptAnalytics> {
        return fetchApi<PromptAnalytics>(`/prompts/${id}/analytics`);
    },
};
