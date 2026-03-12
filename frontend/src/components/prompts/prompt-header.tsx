import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Link from "next/link";

interface PromptHeaderProps {
    title: string;
    author: string;
    category: string;
    aiModel: string;
    tags: string[];
    score: number;
    parentPrompt?: {
        id: string;
        title: string;
    };
}

export function PromptHeader({ title, author, category, aiModel, tags, score, parentPrompt }: PromptHeaderProps) {
    return (
        <div className="flex flex-col gap-4">
            {parentPrompt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-left-2 duration-500">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>Forked from:</span>
                    <Link
                        href={`/prompt/${parentPrompt.id}`}
                        className="text-accent hover:underline font-medium transition-colors"
                    >
                        {parentPrompt.title}
                    </Link>
                </div>
            )}
            <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                    {category}
                </Badge>
                <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">
                    {aiModel}
                </Badge>
                <div className="flex items-center gap-1 ml-auto text-sm font-medium text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {score}
                </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                {title}
            </h1>

            <div className="flex items-center gap-2 mt-2">
                <span className="text-muted-foreground text-sm">Created by</span>
                <span className="font-semibold text-foreground text-sm">{author}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
