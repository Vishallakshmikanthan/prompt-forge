import { fetchApi } from '../api';
import { type Prompt } from './promptService';

export const recommendationService = {
    /**
     * Get similar prompts for a specific prompt
     */
    getSimilarPrompts: async (promptId: string, limit: number = 5): Promise<Prompt[]> => {
        try {
            return await fetchApi<Prompt[]>(`/prompts/${promptId}/similar?limit=${limit}`);
        } catch (error) {
            console.error('Error fetching similar prompts:', error);
            return [];
        }
    },

    /**
     * Get personalized recommendations for a user
     */
    getPersonalizedPrompts: async (userId: string, limit: number = 10): Promise<Prompt[]> => {
        try {
            return await fetchApi<Prompt[]>(`/recommendations/personalized?userId=${userId}&limit=${limit}`);
        } catch (error) {
            console.error('Error fetching personalized prompts:', error);
            return [];
        }
    }
};
