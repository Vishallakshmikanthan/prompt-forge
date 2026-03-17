import { fetchApi } from "../api";
// Re-export type definitions matching backend models
export interface User {
    id: string;
    username: string;
    email: string;
}

export interface Prompt {
    id: string;
    title: string;
    description: string;
    promptContent: string;
    category: string;
    aiModel: string;
    tags: string[];
    score: number;
    moderationStatus: string;
    qualityScore?: number;
    createdAt: string;
    authorId: string;
    author: User;
    parentPromptId?: string;
    parentPrompt?: {
        id: string;
        title: string;
    };
}

export interface CreatePromptInput {
    title: string;
    description: string;
    promptContent: string;
    category: string;
    aiModel: string;
    tags: string[];
    authorId: string;
    parentPromptId?: string;
    username?: string;
    email?: string;
    avatarUrl?: string;
}

export const promptService = {
    /**
     * Retrieve all prompts (descending creation order).
     * Endpoint: GET /prompts
     */
    async getAllPrompts(limit: number = 20, cursor?: string, category?: string): Promise<Prompt[]> {
        const params = new URLSearchParams();
        params.append("limit", limit.toString());
        if (cursor) params.append("cursor", cursor);
        if (category) params.append("category", category);

        return fetchApi<Prompt[]>(`/prompts?${params.toString()}`);
    },

    /**
     * Retrieve a specific prompt by its ID.
     * Endpoint: GET /prompts/:id
     */
    async getPromptById(id: string): Promise<Prompt> {
        return fetchApi<Prompt>(`/prompts/${id}`);
    },

    /**
     * Create a new prompt in the database.
     * Endpoint: POST /prompts
     */
    async createPrompt(data: CreatePromptInput): Promise<Prompt> {
        return fetchApi<Prompt>("/prompts", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    /**
     * Vote for a prompt.
     * Endpoint: POST /prompts/:id/vote
     */
    async votePrompt(id: string, userId: string): Promise<{ updatedPrompt: Prompt }> {
        return fetchApi<{ updatedPrompt: Prompt }>(`/prompts/${id}/vote`, {
            method: "POST",
            body: JSON.stringify({ userId, voteType: "upvote" }),
        });
    },

    /**
     * Delete a prompt owned by the current user.
     * Endpoint: DELETE /prompts/:promptId
     */
    async deletePrompt(promptId: string, userId: string): Promise<void> {
        return fetchApi<void>(`/prompts/${promptId}`, {
            method: "DELETE",
            headers: { "user-id": userId },
        });
    },
};
