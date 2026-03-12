"use client";

import { useEffect, useState } from "react";
import { PromptCard } from "@/components/prompts/prompt-card";
import { discoveryService } from "@/lib/services/discoveryService";
import { type Prompt } from "@/lib/services/promptService";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function NewSection() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const data = await discoveryService.getNewestPrompts(6);
                setPrompts(data);
            } catch (error) {
                console.error("Failed to fetch newest prompts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrompts();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (prompts.length === 0) return null;

    return (
        <section className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Freshly Baked</h2>
                        <p className="text-muted-foreground">The latest prompts added to the collection</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prompts.map((prompt, index) => (
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
        </section>
    );
}
