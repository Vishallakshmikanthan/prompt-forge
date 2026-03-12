import { PromptCard } from "../prompts/prompt-card";
import { type Prompt } from "@/lib/services/promptService";
import { cn } from "@/lib/utils";

interface PromptFeedProps {
    prompts: Prompt[];
    className?: string;
}

export function PromptFeed({ prompts, className }: PromptFeedProps) {
    if (!prompts || prompts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                <p>No prompts found.</p>
            </div>
        );
    }

    return (
        <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
            className
        )}>
            {prompts.map((prompt) => (
                <div key={prompt.id} className="h-full">
                    <PromptCard prompt={prompt} />
                </div>
            ))}
        </div>
    );
}
