"use client";

import { useState, useEffect } from "react";
import { PromptFeed } from "@/components/feed/prompt-feed";
import { promptService } from "@/lib/services/promptService";
import { type Prompt } from "@/lib/services/promptService";
import { Clock } from "lucide-react";

export function LatestPrompts() {
    const [latest, setLatest] = useState<Prompt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                setIsLoading(true);
                const backendPrompts = await promptService.getAllPrompts();

                // Since we don't have true timestamps matching mock style initially, 
                // just reverse to simulate latest.
                const recent = backendPrompts.reverse().slice(0, 4);
                setLatest(recent);
            } catch (err) {
                console.error("Failed to fetch latest prompts:", err);
                setError("Unable to fetch prompts");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatest();
    }, []);

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-2 mb-10">
                    <Clock className="w-6 h-6 text-muted-foreground" />
                    <h2 className="text-3xl font-bold tracking-tight">Freshly Minted</h2>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-destructive bg-destructive/10 rounded-xl">
                        {error}
                    </div>
                ) : latest.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-muted/20 border-2 border-dashed rounded-xl">
                        No fresh prompts found.
                    </div>
                ) : (
                    <PromptFeed prompts={latest} />
                )}
            </div>
        </section>
    );
}
