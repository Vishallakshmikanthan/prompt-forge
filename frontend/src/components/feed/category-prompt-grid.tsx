import { PromptCard } from "../prompts/prompt-card";
import { type Prompt } from "@/lib/services/promptService";
import { cn } from "@/lib/utils";
import { LayoutGrid } from "lucide-react";
import { FlipCard } from "../animations/flip-card";

interface CategoryPromptGridProps {
    prompts: Prompt[];
    className?: string;
}

export function CategoryPromptGrid({ prompts, className }: CategoryPromptGridProps) {
    if (!prompts || prompts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground bg-muted/20 rounded-2xl border border-dashed mt-8">
                <LayoutGrid className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium">No prompts found matching your criteria.</p>
                <p className="text-sm">Try adjusting your filters or search term.</p>
            </div>
        );
    }

    return (
        <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
            className
        )}>
            {prompts.map((prompt) => (
                <FlipCard key={prompt.id} layoutId={`prompt-card-${prompt.id}`} className="h-full">
                    <PromptCard prompt={prompt} />
                </FlipCard>
            ))}
        </div>
    );
}
