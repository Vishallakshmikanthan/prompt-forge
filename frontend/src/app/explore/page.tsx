"use client";

import { TrendingSection } from "@/components/discovery/trending-section";
import { TopSection } from "@/components/discovery/top-section";
import { NewSection } from "@/components/discovery/new-section";
import { PopularSection } from "@/components/discovery/popular-section";
import { PersonalizedSection } from "@/components/discovery/personalized-section";
import { createClient } from "@/lib/supabaseClient";
import { useState, useEffect, Suspense } from "react";
import { type User } from "@supabase/supabase-js";
import { RadiantPromptInput } from "@/components/ui/radiant-prompt-input";
import { useSearchParams } from "next/navigation";
import { CategoryPrompts } from "@/components/categories/category-prompts";
import { Skeleton } from "@/components/ui/skeleton";
import { searchService } from "@/lib/services/searchService";
import { PromptCard } from "@/components/prompts/prompt-card";
import { motion } from "framer-motion";

function ExploreContent() {
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[] | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const supabase = createClient();
    const searchParams = useSearchParams();
    const categoryFilter = searchParams.get("category");

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();
    }, []);

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults(null);
            return;
        }

        setIsSearching(true);
        try {
            const results = await searchService.search(query);
            setSearchResults(results);
        } catch (error) {
            console.error("Search failed:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <main className="flex-grow py-12">
            <div className="max-w-7xl mx-auto px-8">
                <div className="space-y-12 md:space-y-20">
                    {!categoryFilter && (
                        <>
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground/80 to-accent bg-clip-text text-transparent">
                                    Discover Excellence
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-2xl">
                                    Browse through our curated feeds of the most powerful and effective AI prompts across all categories.
                                </p>
                            </div>

                            <div className="flex justify-center w-full">
                                <RadiantPromptInput
                                    value={searchQuery}
                                    onChange={(val) => {
                                        setSearchQuery(val);
                                        if (!val.trim()) setSearchResults(null);
                                    }}
                                    onSubmit={handleSearch}
                                />
                            </div>

                            {isSearching && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                                    ))}
                                </div>
                            )}

                            {searchResults !== null && !isSearching && (
                                <section className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold tracking-tight">
                                            Search Results ({searchResults.length})
                                        </h2>
                                        <button
                                            onClick={() => setSearchResults(null)}
                                            className="text-accent hover:underline text-sm"
                                        >
                                            Clear Results
                                        </button>
                                    </div>
                                    {searchResults.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {searchResults.map((prompt, index) => (
                                                <motion.div
                                                    key={prompt.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                >
                                                    <PromptCard prompt={prompt} />
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-20 text-center">
                                            <p className="text-xl text-muted-foreground">No prompts found matching your query.</p>
                                        </div>
                                    )}
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                                </section>
                            )}

                            {searchResults === null && (
                                <>
                                    {user && (
                                        <>
                                            <PersonalizedSection userId={user.id} />
                                            <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                                        </>
                                    )}

                                    <TrendingSection />
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                                    <PopularSection />
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                                    <TopSection />
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                                    <NewSection />
                                </>
                            )}
                        </>
                    )}

                    {categoryFilter && (
                        <CategoryPrompts categorySlug={categoryFilter} />
                    )}
                </div>
            </div>
        </main>
    );
}

export default function ExplorePage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Suspense fallback={
                <div className="max-w-7xl mx-auto px-8 py-20 space-y-12">
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-[400px] w-full rounded-2xl" />
                </div>
            }>
                <ExploreContent />
            </Suspense>
        </div>
    );
}
