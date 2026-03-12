"use client";

import { useState, useEffect } from "react";
import { type Prompt } from "@/lib/services/promptService";
import { bookmarkService } from "@/lib/services/bookmarkService";
import { useAuth } from "@/components/auth/auth-provider";
import { CategoryPromptGrid } from "@/components/feed/category-prompt-grid";
import { Button } from "@/components/ui/button";
import { Bookmark, Loader2 } from "lucide-react";
import Link from "next/link";

export default function BookmarksPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [bookmarks, setBookmarks] = useState<Prompt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthLoading || !user) return;

        const fetchBookmarks = async () => {
            try {
                setIsLoading(true);
                const data = await bookmarkService.getBookmarks(user.id);
                setBookmarks(data);
            } catch (err: any) {
                console.error("Failed to fetch bookmarks:", err);
                setError(err.message || "Unable to fetch bookmarks");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookmarks();
    }, [user, isAuthLoading]);

    if (isAuthLoading || (user && isLoading)) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center pt-24 pb-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading your bookmarks...</p>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center pt-24 pb-20">
                <div className="bg-muted/20 border-2 border-dashed p-12 rounded-xl text-center max-w-md">
                    <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                    <p className="text-muted-foreground mb-6">Please log in to view and manage your bookmarked prompts.</p>
                    <Button onClick={() => window.location.href = '/'}>Go back to home</Button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col gap-2 mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Your Saved Prompts</h1>
                    <p className="text-xl text-muted-foreground">Quick access to the prompts you've bookmarked for later.</p>
                </div>

                {error ? (
                    <div className="bg-destructive/10 text-destructive p-8 rounded-xl text-center">
                        <p>{error}</p>
                    </div>
                ) : bookmarks.length > 0 ? (
                    <CategoryPromptGrid prompts={bookmarks} />
                ) : (
                    <div className="bg-muted/20 border-2 border-dashed p-12 rounded-xl text-center">
                        <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                        <h2 className="text-xl font-bold mb-2">No bookmarks yet</h2>
                        <p className="text-muted-foreground mb-6">You haven't saved any prompts yet. Explore categories to find some!</p>
                        <Link href="/categories">
                            <Button>Explore Categories</Button>
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
