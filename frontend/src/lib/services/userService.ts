import { fetchApi } from "../api";

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    reputation: number;
    bio: string | null;
    avatarUrl: string | null;
    githubUrl: string | null;
    website: string | null;
    createdAt: string;
    _count: {
        prompts: number;
        bookmarks: number;
    };
    stats: {
        promptsCreated: number;
        forksCreated: number;
        bookmarksSaved: number;
        totalLikes: number;
        totalForks: number;
        totalViews: number;
    };
}

export interface UserPrompt {
    id: string;
    title: string;
    description: string;
    category: string;
    aiModel: string;
    tags: string[];
    score: number;
    createdAt: string;
    author: {
        username: string;
        avatarUrl: string | null;
    };
    _count: {
        votes: number;
        bookmarks: number;
        forkedPrompts: number;
        versions: number;
    };
}

export interface ActivityDay {
    day: string;
    count: number;
}

export interface ActivityGraphData {
    days: ActivityDay[];
    totalContributions: number;
}

export interface AnalyticsDataPoint {
    name: string;
    views: number;
    usage: number;
    forks: number;
}

export interface FeaturedPromptData {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    score: number;
    forks: number;
    likes: number;
    views: number;
}

export interface CollectionData {
    title: string;
    count: number;
}

export interface TimelineEvent {
    type: string;
    content: string;
    timestamp: string;
}

export const userService = {
    async getUserProfile(username: string): Promise<UserProfile> {
        return fetchApi<UserProfile>(`/users/${username}`);
    },

    async getUserPrompts(username: string): Promise<UserPrompt[]> {
        return fetchApi<UserPrompt[]>(`/users/${username}/prompts`);
    },

    async getUserForks(username: string): Promise<UserPrompt[]> {
        return fetchApi<UserPrompt[]>(`/users/${username}/forks`);
    },

    async getUserBookmarks(username: string): Promise<UserPrompt[]> {
        return fetchApi<UserPrompt[]>(`/users/${username}/bookmarks`);
    },

    async getLeaderboard(limit: number = 10): Promise<LeaderboardUser[]> {
        return fetchApi<LeaderboardUser[]>(`/users/leaderboard?limit=${limit}`);
    },

    async getActivityGraph(username: string): Promise<ActivityGraphData> {
        return fetchApi<ActivityGraphData>(`/users/${username}/activity`);
    },

    async getAnalytics(username: string): Promise<AnalyticsDataPoint[]> {
        return fetchApi<AnalyticsDataPoint[]>(`/users/${username}/analytics`);
    },

    async getFeaturedPrompt(username: string): Promise<FeaturedPromptData | null> {
        return fetchApi<FeaturedPromptData | null>(`/users/${username}/featured`);
    },

    async getCollections(username: string): Promise<CollectionData[]> {
        return fetchApi<CollectionData[]>(`/users/${username}/collections`);
    },

    async getTimeline(username: string): Promise<TimelineEvent[]> {
        return fetchApi<TimelineEvent[]>(`/users/${username}/timeline`);
    },
    
    async getOwnProfile(userId: string): Promise<{ user: any; stats: any }> {
        return fetchApi<{ user: any; stats: any }>(`/profile`, {
            headers: { 'user-id': userId }
        });
    },
};

export interface LeaderboardUser {
    id: string;
    username: string;
    avatarUrl: string | null;
    reputation: number;
    _count: {
        prompts: number;
    };
}

