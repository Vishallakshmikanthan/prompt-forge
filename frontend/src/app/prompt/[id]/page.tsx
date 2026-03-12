"use client";

import { useState, useEffect, use } from "react";
import { type Prompt } from "@/lib/services/promptService";
import { promptService } from "@/lib/services/promptService";
import { analyticsService, type PromptAnalytics } from "@/lib/services/analyticsService";
import { recommendationService } from "@/lib/services/recommendationService";
import { PromptHeader } from "@/components/prompts/prompt-header";
import { PromptActions } from "@/components/prompts/prompt-actions";
import { PromptContent } from "@/components/prompts/prompt-content";
import { PromptMetadata } from "@/components/prompts/prompt-metadata";
import { VersionHistory } from "@/components/prompts/version-history";
import { CategoryPromptGrid } from "@/components/feed/category-prompt-grid";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PromptPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function PromptPage({ params }: PromptPageProps) {
    const resolvedParams = use(params);
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [analytics, setAnalytics] = useState<PromptAnalytics | null>(null);
    const [recommendedPrompts, setRecommendedPrompts] = useState<Prompt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPromptData = async () => {
            try {
                setIsLoading(true);

                // Fetch basic prompt info first to ensure it exists
                const backendPrompt = await promptService.getPromptById(resolvedParams.id);

                if (!backendPrompt) {
                    setPrompt(null);
                    setError(null);
                    setIsLoading(false);
                    return;
                }

                setPrompt(backendPrompt);

                // Fetch analytics and recommendations in parallel now that we know the prompt exists
                const [analyticsData, recommendations] = await Promise.all([
                    analyticsService.getPromptAnalytics(backendPrompt.id),
                    recommendationService.getSimilarPrompts(resolvedParams.id, 4),
                    analyticsService.trackPromptView(backendPrompt.id).catch(() => null) // Fire and forget view tracking
                ]);

                setAnalytics(analyticsData);
                setRecommendedPrompts(recommendations);
            } catch (err) {
                console.error("Failed to fetch prompt:", err);
                setError("Unable to fetch prompts");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPromptData();
    }, [resolvedParams.id]);

    if (isLoading) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center pt-24 pb-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Loading prompt details...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center pt-24 pb-20">
                <div className="bg-destructive/10 text-destructive p-8 rounded-xl max-w-md text-center">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </main>
        );
    }

    if (!prompt) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center pt-24 pb-20">
                <div className="bg-muted/20 border-2 border-dashed p-12 rounded-xl text-center">
                    <h2 className="text-2xl font-bold mb-2">Prompt Not Found</h2>
                    <p className="text-muted-foreground mb-6">The prompt you are looking for does not exist or has been removed.</p>
                    <Link href="/categories">
                        <Button>Browse Categories</Button>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col pt-24 pb-20">
            {/* Back Navigation */}
            <div className="container mx-auto px-4 mb-8">
                <Link href={`/categories/${encodeURIComponent(prompt.category)}`}>
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground -ml-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to {prompt.category}
                    </Button>
                </Link>
            </div>

            {/* Top Section: Header & Actions */}
            <div className="container mx-auto px-4 max-w-5xl mb-12">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8 pb-8 border-b">
                    <div className="flex-1">
                        <PromptHeader
                            title={prompt.title}
                            author={prompt.author?.username || "Unknown Author"}
                            category={prompt.category}
                            aiModel={prompt.aiModel}
                            tags={prompt.tags}
                            score={prompt.score}
                            parentPrompt={prompt.parentPrompt}
                        />
                    </div>
                    <div className="shrink-0 w-full lg:w-auto">
                        <PromptActions
                            promptId={prompt.id}
                            promptText={prompt.promptContent}
                            title={prompt.title}
                            description={prompt.description}
                            category={prompt.category}
                            aiModel={prompt.aiModel}
                            tags={prompt.tags}
                        />
                    </div>
                </div>

                {/* Main Content & Metadata Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Column: Prompt Content */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Description</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {prompt.description}
                            </p>
                        </div>

                        <PromptContent content={prompt.promptContent} />
                    </div>

                    {/* Right Column: Metadata & History */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Prompt Details</h3>
                            <PromptMetadata
                                author={prompt.author?.username || "Unknown"}
                                createdAt={prompt.createdAt}
                                views={analytics?.views}
                                votes={analytics?.votes}
                                forks={analytics?.forks}
                                bookmarks={analytics?.bookmarks}
                            />
                        </div>

                        <div>
                            <VersionHistory promptId={prompt.id} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended Prompts Section */}
            {recommendedPrompts.length > 0 && (
                <div className="bg-muted/10 border-t py-16 mt-auto">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight mb-2">Recommended Prompts</h2>
                                <p className="text-muted-foreground">Semantically similar to this prompt.</p>
                            </div>
                            <Link href={`/categories/${encodeURIComponent(prompt.category)}`}>
                                <Button variant="outline">View All</Button>
                            </Link>
                        </div>

                        <CategoryPromptGrid prompts={recommendedPrompts} />
                    </div>
                </div>
            )}
        </main>
    );
}
