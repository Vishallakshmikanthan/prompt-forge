"use client";

import { useState, useMemo, use, useEffect } from "react";
import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/mock-categories";
import { type Prompt } from "@/lib/services/promptService";
import { promptService } from "@/lib/services/promptService";
import { CategoryHeader } from "@/components/categories/category-header";
import { CategorySearch } from "@/components/categories/category-search";
import { CategoryFilters } from "@/components/categories/category-filters";
import { CategoryPromptGrid } from "@/components/feed/category-prompt-grid";
import { Badge } from "@/components/ui/badge";

interface CategoryPageProps {
    params: Promise<{
        category: string;
    }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
    const resolvedParams = use(params);
    const categoryName = decodeURIComponent(resolvedParams.category);
    const category = CATEGORIES.find(c => c.name === categoryName);

    if (!category) {
        notFound();
    }

    // 1. Data Fetching State
    const [promptsData, setPromptsData] = useState<Prompt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                setIsLoading(true);
                // Fetch prompts for this specific category from the backend
                const backendPrompts = await promptService.getAllPrompts(20, undefined, categoryName);
                setPromptsData(backendPrompts);
            } catch (err) {
                console.error("Failed to fetch prompts:", err);
                setError("Unable to fetch prompts");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrompts();
    }, [categoryName]);

    // 2. Base Prompts is now state-driven
    const baseCategoryPrompts = promptsData;

    // Derived states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<"latest" | "most_upvoted" | "highest_score">("latest");

    // Extract dynamic available tags for this specific category
    const availableTags = useMemo(() => {
        const allTags = baseCategoryPrompts.flatMap(p => p.tags);
        const uniqueTags = Array.from(new Set(allTags));
        // Exclude the category name itself from the tag filter list to avoid redundancy
        return uniqueTags.filter(t => t.toLowerCase() !== categoryName.toLowerCase());
    }, [baseCategoryPrompts, categoryName]);

    // Handle tag toggling
    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    // Apply Filters & Sorting Dynamically
    const filteredPrompts = useMemo(() => {
        let result = [...baseCategoryPrompts];

        // Apply Search
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(lowerSearch) ||
                p.description.toLowerCase().includes(lowerSearch)
            );
        }

        // Apply Model Filter
        if (selectedModel) {
            result = result.filter(p => p.aiModel === selectedModel);
        }

        // Apply Tags Filter
        if (selectedTags.length > 0) {
            result = result.filter(p =>
                selectedTags.every(tag => p.tags.includes(tag))
            );
        }

        // Apply Sorting
        result.sort((a, b) => {
            if (sortBy === "latest") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (sortBy === "most_upvoted") {
                return b.score - a.score;
            }
            if (sortBy === "highest_score") {
                return b.score - a.score;
            }
            return 0;
        });

        return result;
    }, [baseCategoryPrompts, searchTerm, selectedModel, selectedTags, sortBy]);

    return (
        <main className="flex min-h-screen flex-col pt-24 pb-16">
            <div className="container mx-auto px-4 mb-10">
                <CategoryHeader
                    title={category.name}
                    description={category.description}
                    promptCount={baseCategoryPrompts.length}
                    icon={category.icon}
                />
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <CategorySearch
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                <CategoryFilters
                    availableTags={availableTags}
                    selectedModel={selectedModel}
                    onModelChange={setSelectedModel}
                    selectedTags={selectedTags}
                    onTagToggle={handleTagToggle}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                        <p>Loading prompts...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-destructive/10 rounded-xl my-8 text-destructive p-6 text-center">
                        <p className="font-medium text-lg mb-2">{error}</p>
                        <p className="text-sm opacity-80">Please check your backend connection.</p>
                    </div>
                ) : baseCategoryPrompts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border-2 border-dashed rounded-xl my-8 text-muted-foreground p-6 text-center">
                        <p className="font-medium text-lg mb-2">No prompts found</p>
                        <p className="text-sm">Be the first to create a prompt for {category.name}!</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-6">
                            <h2 className="text-xl font-semibold">
                                {filteredPrompts.length} {filteredPrompts.length === 1 ? 'Result' : 'Results'}
                            </h2>
                            {(searchTerm || selectedModel || selectedTags.length > 0) && (
                                <Badge variant="outline" className="text-muted-foreground ml-2 rounded-full cursor-pointer hover:bg-muted" onClick={() => {
                                    setSearchTerm("");
                                    setSelectedModel(null);
                                    setSelectedTags([]);
                                    setSortBy("latest");
                                }}>
                                    Clear Filters
                                </Badge>
                            )}
                        </div>
                        <CategoryPromptGrid prompts={filteredPrompts} />
                    </>
                )}
            </div>
        </main>
    );
}

