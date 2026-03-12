"use client";

import { useEffect, useState, use } from "react";
import { searchService, type SearchResult } from "@/lib/services/searchService";
import { PromptCard } from "@/components/prompts/prompt-card";
import { Loader2, Search, SlidersHorizontal, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query) return;

        const performSearch = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await searchService.search(query);
                setResults(data);
            } catch (err: any) {
                console.error("Search failed:", err);
                setError("Something went wrong with the semantic search.");
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [query]);

    return (
        <main className="min-h-screen pt-24 pb-20 bg-muted/5">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Search Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                            <Search className="h-4 w-4" />
                            Semantic Search
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">
                            Results for "{query}"
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            We used AI to find prompts that match the core meaning and intent of your query.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-full gap-2">
                            <Info className="h-4 w-4" />
                            About Semantic Search
                        </Button>
                        <Button variant="outline" className="rounded-full gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 8].map((i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-[250px] w-full rounded-2xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-destructive/10 text-destructive p-8 rounded-2xl border border-destructive/20 text-center max-w-lg mx-auto">
                        <p className="font-bold mb-2">Search Error</p>
                        <p>{error}</p>
                    </div>
                ) : results.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {results.map((prompt) => (
                                <div key={prompt.id} className="relative group">
                                    {/* Similarity Badge */}
                                    <div className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        {(prompt.similarity * 100).toFixed(0)}% Match
                                    </div>
                                    {/* @ts-ignore - Similarity is extra but PromptCard handles prompt structure */}
                                    <PromptCard prompt={prompt} />
                                </div>
                            ))}
                        </div>

                        {/* Summary Footer */}
                        <div className="mt-12 text-center text-sm text-muted-foreground bg-accent/5 py-4 rounded-xl border border-accent/10">
                            Found {results.length} results that semantically match your intent.
                        </div>
                    </>
                ) : (
                    <div className="text-center py-24 bg-card rounded-3xl border-2 border-dashed border-border/50 max-w-2xl mx-auto">
                        <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="h-8 w-8 text-primary opacity-40" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-foreground">No semantic matches found</h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-8 px-6 text-balance">
                            We couldn't find any prompts that meaningfullly match your search. Try using more descriptive keywords or broader terms.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
