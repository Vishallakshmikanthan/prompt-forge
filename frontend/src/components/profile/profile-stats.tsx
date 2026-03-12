import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Sparkles, Library, GitFork, Bookmark } from "lucide-react";

interface ProfileStatsProps {
    stats: {
        promptsCreated: number;
        forksCreated: number;
        bookmarksSaved: number;
    };
    reputation: number;
}

export function ProfileStats({ stats, reputation }: ProfileStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Reputation</CardTitle>
                    <Sparkles className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{reputation.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Community rating
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Prompts Created</CardTitle>
                    <Library className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.promptsCreated.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Original prompts shared
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Forks Created</CardTitle>
                    <GitFork className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.forksCreated.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Prompts derived from others
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bookmarks Saved</CardTitle>
                    <Bookmark className="h-4 w-4 text-indigo-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.bookmarksSaved.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Prompts saved for later
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
