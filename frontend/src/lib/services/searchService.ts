import { fetchApi } from "../api";

export interface SearchResult {
    id: string;
    title: string;
    description: string;
    promptContent: string;
    category: string;
    aiModel: string;
    tags: string[];
    score: number;
    createdAt: string;
    similarity: number;
    author: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
}

export const searchService = {
    /**
     * Perform a semantic search query.
     * Endpoint: GET /search?q=...
     */
    async search(query: string): Promise<SearchResult[]> {
        return fetchApi<SearchResult[]>(`/search?q=${encodeURIComponent(query)}`);
    }
};
