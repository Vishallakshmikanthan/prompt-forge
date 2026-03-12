import { fetchApi } from "../api";
import { type Prompt } from "./promptService";

export const bookmarkService = {
    /**
     * Save a prompt to the user's bookmark list.
     * Endpoint: POST /prompts/:id/bookmark
     */
    async addBookmark(promptId: string, userId: string): Promise<void> {
        return fetchApi<void>(`/bookmarks/${promptId}`, {
            method: "POST",
            body: JSON.stringify({ userId }),
        });
    },

    /**
     * Remove a prompt from bookmarks.
     * Endpoint: DELETE /bookmarks/:id
     */
    async removeBookmark(promptId: string, userId: string): Promise<void> {
        return fetchApi<void>(`/bookmarks/${promptId}`, {
            method: "DELETE",
            body: JSON.stringify({ userId }),
        });
    },

    /**
     * Retrieve all prompts bookmarked by the current user.
     * Endpoint: GET /bookmarks/me
     */
    async getBookmarks(userId: string): Promise<Prompt[]> {
        return fetchApi<Prompt[]>(`/bookmarks/me?userId=${userId}`);
    },
};
