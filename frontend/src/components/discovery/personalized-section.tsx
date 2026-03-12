"use client";

import { useEffect, useState } from "react";
import { type Prompt } from "@/lib/services/promptService";
import { recommendationService } from "@/lib/services/recommendationService";
import { CategoryPromptGrid } from "@/components/feed/category-prompt-grid";
import { Sparkles } from "lucide-react";

interface PersonalizedSectionProps {
    userId: string;
}

export const PersonalizedSection = ({ userId }: PersonalizedSectionProps) => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPersonalized = async () => {
            try {
                setIsLoading(true);
                const data = await recommendationService.getPersonalizedPrompts(userId, 4);
                setPrompts(data);
            } catch (error) {
                console.error("Failed to fetch personalized prompts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchPersonalized();
        }
    }, [userId]);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (prompts.length === 0) {
        return null;
    }

    return (
        <section className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Picked For You</h2>
                    <p className="text-muted-foreground">Based on your activity and interests.</p>
                </div>
            </div>

            <CategoryPromptGrid prompts={prompts} />
        </section>
    );
};
