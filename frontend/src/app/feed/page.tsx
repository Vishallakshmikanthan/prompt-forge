"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptCard } from "@/components/ui/prompt-card";
import { useAuth } from "@/components/auth/auth-provider";
import { userService, type UserPrompt } from "@/lib/services/userService";
import { Rss, Users, ArrowLeft, Loader2 } from "lucide-react";

const PAGE_SIZE = 20;

export default function FeedPage() {
    const { user } = useAuth();

    const [prompts, setPrompts] = useState<UserPrompt[]>([]);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchFeed = useCallback(
        async (nextOffset: number, append: boolean) => {
            if (!user) return;
            if (append) setLoadingMore(true);
            else setLoading(true);

            try {
                const result = await userService.getFeed(user.id, PAGE_SIZE, nextOffset);
                setPrompts((prev) => (append ? [...prev, ...result.prompts] : result.prompts));
                setTotal(result.total);
                setHasMore(result.hasMore);
                setOffset(nextOffset + result.prompts.length);
            } catch {
                // silently fail — empty state handles it
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [user]
    );

    useEffect(() => {
        if (user) {
            setOffset(0);
            fetchFeed(0, false);
        } else {
            setLoading(false);
        }
    }, [user, fetchFeed]);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6">
                <Rss className="w-16 h-16 text-muted-foreground/40" />
                <div>
                    <h1 className="text-3xl font-bold mb-2">Your Feed</h1>
                    <p className="text-muted-foreground max-w-md">
                        Sign in to see the latest prompts from people you follow.
                    </p>
                </div>
                <Link href="/auth/login">
                    <Button className="rounded-full px-8">Sign in</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/explore">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Rss className="h-7 w-7 text-primary" />
                            Feed
                        </h1>
                        {!loading && (
                            <p className="text-sm text-muted-foreground">
                                {total > 0 ? `${total} prompt${total !== 1 ? "s" : ""} from people you follow` : ""}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-xl" />
                    ))}
                </div>
            ) : prompts.length === 0 ? (
                <EmptyFeedState />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {prompts.map((prompt) => (
                            <PromptCard
                                key={prompt.id}
                                title={prompt.title}
                                description={prompt.description}
                                category={prompt.category}
                                author={prompt.author?.username ?? ""}
                                stats={{
                                    likes: prompt._count?.votes ?? 0,
                                    forks: prompt._count?.forkedPrompts ?? 0,
                                    comments: 0,
                                }}
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="flex justify-center pt-4">
                            <Button
                                variant="outline"
                                className="rounded-full px-8 gap-2"
                                disabled={loadingMore}
                                onClick={() => fetchFeed(offset, true)}
                            >
                                {loadingMore ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    "Load more"
                                )}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function EmptyFeedState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="p-6 bg-muted rounded-3xl">
                <Users className="w-14 h-14 text-muted-foreground/60 mx-auto" />
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-2">Your feed is empty</h2>
                <p className="text-muted-foreground max-w-sm">
                    Follow other users to see their latest prompts here.
                </p>
            </div>
            <div className="flex gap-3">
                <Link href="/explore">
                    <Button className="rounded-full px-6">Explore Prompts</Button>
                </Link>
                <Link href="/leaderboard">
                    <Button variant="outline" className="rounded-full px-6">
                        Discover Users
                    </Button>
                </Link>
            </div>
        </div>
    );
}
