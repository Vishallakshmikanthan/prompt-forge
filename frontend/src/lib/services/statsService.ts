import { fetchApi } from "../api";

export interface CategoryStat {
    category: string;
    promptCount: number;
}

export interface CommunityStats {
    members: number;
    discussions: number;
    reviews: number;
    trending: { tag: string; count: number }[];
}

export const statsService = {
    /**
     * Fetch prompt counts per category.
     */
    async getCategoryStats(): Promise<CategoryStat[]> {
        return fetchApi<CategoryStat[]>("/stats/categories");
    },

    /**
     * Fetch overall community statistics.
     */
    async getCommunityStats(): Promise<CommunityStats> {
        return fetchApi<CommunityStats>("/stats/community");
    },
};
