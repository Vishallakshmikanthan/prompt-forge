import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bot, Tag } from "lucide-react";

interface PromptMetaProps {
    category: string;
    aiModel: string;
    tags?: string[];
    className?: string;
}

export function PromptMeta({ category, aiModel, tags = [], className }: PromptMetaProps) {
    return (
        <div className={cn("flex flex-wrap items-center gap-2", className)}>
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                {category}
            </Badge>

            <Badge variant="outline" className="gap-1 text-xs">
                <Bot className="w-3 h-3" />
                {aiModel}
            </Badge>

            {tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="gap-1 text-xs text-muted-foreground hidden sm:flex">
                    <Tag className="w-3 h-3" />
                    {tag}
                </Badge>
            ))}

            {tags.length > 2 && (
                <Badge variant="outline" className="text-xs text-muted-foreground hidden sm:inline-flex">
                    +{tags.length - 2}
                </Badge>
            )}
        </div>
    );
}
