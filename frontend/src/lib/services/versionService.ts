import { fetchApi } from "../api";

export interface PromptVersion {
    id: string;
    versionNumber: number;
    promptContent: string;
    createdAt: string;
    promptId: string;
}

export const versionService = {
    /**
     * Retrieve all historical versions of a prompt.
     * Endpoint: GET /prompts/:id/versions
     */
    async getPromptVersions(promptId: string): Promise<PromptVersion[]> {
        return fetchApi<PromptVersion[]>(`/prompts/${promptId}/versions`);
    },
};
