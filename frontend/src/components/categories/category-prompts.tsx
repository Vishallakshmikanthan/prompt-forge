"use client";

import { useEffect, useState } from "react";
import { PromptCard } from "@/components/prompts/prompt-card";
import { promptService, type Prompt } from "@/lib/services/promptService";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/mock-categories";

interface CategoryPromptsProps {
    categorySlug: string;
}

export function CategoryPrompts({ categorySlug }: CategoryPromptsProps) {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const category = CATEGORIES.find(c => c.slug === categorySlug) || {
        name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace("-", " "),
        description: `Explore prompts for ${categorySlug}`
    };

    useEffect(() => {
        const fetchPrompts = async () => {
            setIsLoading(true);
            try {
                // Using the category name for filtering as the backend likely expects the actual category string
                const data = await promptService.getAllPrompts(20, undefined, category.name);
                setPrompts(data);
            } catch (error) {
                console.error("Failed to fetch category prompts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrompts();
    }, [category.name]);

    if (isLoading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-6 w-full max-w-2xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-[350px] w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">
                    Category Filter
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white italic">
                    {category.name}
                </h2>
                <p className="text-zinc-400 text-lg max-w-3xl leading-relaxed">
                    {category.description}
                </p>
            </div>

            {prompts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-900/30 rounded-3xl border border-zinc-800/50">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
                        <span className="text-2xl">🔍</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No prompts found</h3>
                    <p className="text-zinc-500 max-w-sm">
                        Requested category "{category.name}" doesn't have any prompts yet. Be the first to publish one!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {prompts.map((prompt, index) => (
                        <motion.div
                            key={prompt.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <PromptCard prompt={prompt} />
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
}
