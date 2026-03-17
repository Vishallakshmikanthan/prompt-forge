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

    /**
     * Restore a prompt to the content of a specific version.
     * Endpoint: PATCH /prompts/:id/versions/:versionId/restore
     */
    async restoreVersion(promptId: string, versionId: string, userId: string): Promise<void> {
        return fetchApi<void>(`/prompts/${promptId}/versions/${versionId}/restore`, {
            method: "PATCH",
            headers: { "user-id": userId },
        });
    },
};
