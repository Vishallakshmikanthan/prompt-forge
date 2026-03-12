"use client";

import { useState, useEffect } from "react";
import { PromptFeed } from "@/components/feed/prompt-feed";
import { promptService } from "@/lib/services/promptService";
import { type Prompt } from "@/lib/services/promptService";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function TrendingPrompts() {
    const [trending, setTrending] = useState<Prompt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                setIsLoading(true);
                const backendPrompts = await promptService.getAllPrompts();

                // Top 4 prompts by score
                const sorted = backendPrompts.sort((a, b) => b.score - a.score).slice(0, 4);
                setTrending(sorted);
            } catch (err) {
                console.error("Failed to fetch trending prompts:", err);
                setError("Unable to fetch prompts");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrending();
    }, []);

    return (
        <section className="py-20 bg-muted/20">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Trending Prompts</h2>
                        <p className="text-muted-foreground">The most forked and liked prompts this week.</p>
                    </div>
                    <Link href="/prompts/trending" className="hidden sm:inline-flex items-center text-sm font-medium text-primary hover:underline group">
                        View all trending
                        <ArrowUpRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-destructive bg-destructive/10 rounded-xl">
                        {error}
                    </div>
                ) : trending.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-muted/20 border-2 border-dashed rounded-xl">
                        No trending prompts found.
                    </div>
                ) : (
                    <PromptFeed prompts={trending} />
                )}

                <div className="mt-8 sm:hidden">
                    <Link href="/prompts/trending" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                        View all trending
                    </Link>
                </div>
            </div>
        </section>
    );
}
