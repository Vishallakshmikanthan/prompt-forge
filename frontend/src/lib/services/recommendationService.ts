import { type Prompt } from './promptService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const recommendationService = {
    /**
     * Get similar prompts for a specific prompt
     */
    getSimilarPrompts: async (promptId: string, limit: number = 5): Promise<Prompt[]> => {
        try {
            const response = await fetch(`${API_URL}/prompts/${promptId}/similar?limit=${limit}`);
            const result = await response.json();

            if (result.status === 'success') {
                return result.data;
            }
            return [];
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
            const response = await fetch(`${API_URL}/recommendations/personalized?userId=${userId}&limit=${limit}`);
            const result = await response.json();

            if (result.status === 'success') {
                return result.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching personalized prompts:', error);
            return [];
        }
    }
};
