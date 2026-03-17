"use client";

import { useState, useEffect, use } from "react";
import { type Prompt } from "@/lib/services/promptService";
import { promptService } from "@/lib/services/promptService";
import { analyticsService, type PromptAnalytics } from "@/lib/services/analyticsService";
import { recommendationService } from "@/lib/services/recommendationService";
import { versionService, type PromptVersion } from "@/lib/services/versionService";
import { PromptHeader } from "@/components/prompts/prompt-header";
import { PromptActions } from "@/components/prompts/prompt-actions";
import { PromptContent } from "@/components/prompts/prompt-content";
import { PromptMetadata } from "@/components/prompts/prompt-metadata";
import { VersionHistory } from "@/components/prompts/version-history";
import { PromptDiffViewer } from "@/components/prompts/prompt-diff-viewer";
import { CategoryPromptGrid } from "@/components/feed/category-prompt-grid";
import CommentSection from "@/components/CommentSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, GitCompare, History } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { format } from "date-fns";
import { toast } from "sonner";

interface PromptPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function PromptPage({ params }: PromptPageProps) {
    const resolvedParams = use(params);
    const { user } = useAuth();
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [analytics, setAnalytics] = useState<PromptAnalytics | null>(null);
    const [recommendedPrompts, setRecommendedPrompts] = useState<Prompt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // History tab state
    const [versions, setVersions] = useState<PromptVersion[]>([]);
    const [versionsLoading, setVersionsLoading] = useState(false);
    const [selectedA, setSelectedA] = useState<string>("");
    const [selectedB, setSelectedB] = useState<string>("");
    const [isRestoring, setIsRestoring] = useState<string | null>(null);

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

    const handleTabChange = async (value: string) => {
        if (value === "history" && versions.length === 0 && !versionsLoading && prompt) {
            setVersionsLoading(true);
            try {
                const data = await versionService.getPromptVersions(prompt.id);
                setVersions(data);
                if (data.length >= 2) {
                    setSelectedA(data[data.length - 1].id); // oldest
                    setSelectedB(data[0].id);               // newest
                }
            } catch (err) {
                console.error("Failed to load version history:", err);
            } finally {
                setVersionsLoading(false);
            }
        }
    };

    const handleRestore = async (versionId: string) => {
        if (!user || !prompt) return;
        setIsRestoring(versionId);
        try {
            await versionService.restoreVersion(prompt.id, versionId, user.id);
            toast.success("Prompt restored to selected version");
            // Refresh prompt content and version list
            const [updatedPrompt, updatedVersions] = await Promise.all([
                promptService.getPromptById(prompt.id),
                versionService.getPromptVersions(prompt.id),
            ]);
            setPrompt(updatedPrompt);
            setVersions(updatedVersions);
            if (updatedVersions.length >= 2) {
                setSelectedA(updatedVersions[updatedVersions.length - 1].id);
                setSelectedB(updatedVersions[0].id);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to restore version");
        } finally {
            setIsRestoring(null);
        }
    };

    const diffVersionA = versions.find((v) => v.id === selectedA) ?? null;
    const diffVersionB = versions.find((v) => v.id === selectedB) ?? null;

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
            <div className="container mx-auto px-4 max-w-5xl mb-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8 pb-8 border-b">
                    <div className="flex-1">
                        <PromptHeader
                            title={prompt.title}
                            author={prompt.author?.username || "Unknown Author"}
                            category={prompt.category}
                            aiModel={prompt.aiModel}
                            tags={prompt.tags}
                            score={prompt.score}
                            securityWarnings={prompt.securityWarnings}
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
                            authorId={prompt.authorId}
                            onDeleted={() => router.push("/categories")}
                        />
                    </div>
                </div>

                {/* Tabbed content: Overview and History */}
                <Tabs defaultValue="overview" onValueChange={handleTabChange}>
                    <TabsList className="mb-8">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="history">
                            <History className="w-3.5 h-3.5 mr-1.5" />
                            History
                        </TabsTrigger>
                    </TabsList>

                    {/* ── Overview Tab ── */}
                    <TabsContent value="overview">
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

                                <CommentSection promptId={prompt.id} />
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
                    </TabsContent>

                    {/* ── History Tab ── */}
                    <TabsContent value="history">
                        {versionsLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            </div>
                        ) : versions.length === 0 ? (
                            <div className="py-16 text-center text-muted-foreground">
                                No version history available for this prompt.
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Version selectors */}
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <div className="flex items-center gap-2 flex-1">
                                        <GitCompare className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <label className="text-sm font-medium whitespace-nowrap">Compare:</label>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                                        <select
                                            value={selectedA}
                                            onChange={(e) => setSelectedA(e.target.value)}
                                            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            {versions.map((v) => (
                                                <option key={v.id} value={v.id}>
                                                    V{v.versionNumber} — {format(new Date(v.createdAt), "MMM d, yyyy · HH:mm")} — {v.promptContent.slice(0, 60)}{v.promptContent.length > 60 ? "…" : ""}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="hidden sm:flex items-center text-muted-foreground text-sm">vs</span>
                                        <select
                                            value={selectedB}
                                            onChange={(e) => setSelectedB(e.target.value)}
                                            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            {versions.map((v) => (
                                                <option key={v.id} value={v.id}>
                                                    V{v.versionNumber} — {format(new Date(v.createdAt), "MMM d, yyyy · HH:mm")} — {v.promptContent.slice(0, 60)}{v.promptContent.length > 60 ? "…" : ""}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Diff viewer */}
                                {diffVersionA && diffVersionB && diffVersionA.id !== diffVersionB.id ? (
                                    <PromptDiffViewer
                                        versionA={diffVersionA}
                                        versionB={diffVersionB}
                                        onRestore={user && prompt.authorId === user.id ? handleRestore : undefined}
                                        isRestoring={isRestoring}
                                    />
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        Select two different versions above to compare them.
                                    </p>
                                )}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
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
