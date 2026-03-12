import { fetchApi } from "../api";
import { Prompt } from "./promptService";

export const discoveryService = {
    /**
     * Fetch trending prompts based on engagement score and recency.
     */
    async getTrendingPrompts(limit: number = 6): Promise<Prompt[]> {
        return fetchApi<Prompt[]>(`/prompts/trending?limit=${limit}`);
    },

    /**
     * Fetch top prompts based on historical score.
     */
    async getTopPrompts(limit: number = 6): Promise<Prompt[]> {
        return fetchApi<Prompt[]>(`/prompts/top?limit=${limit}`);
    },

    /**
     * Fetch newest prompts based on creation date.
     */
    async getNewestPrompts(limit: number = 6): Promise<Prompt[]> {
        return fetchApi<Prompt[]>(`/prompts/new?limit=${limit}`);
    },

    /**
     * Fetch hot prompts (recently popular).
     */
    async getHotPrompts(limit: number = 6): Promise<Prompt[]> {
        return fetchApi<Prompt[]>(`/prompts/hot?limit=${limit}`);
    },
};
