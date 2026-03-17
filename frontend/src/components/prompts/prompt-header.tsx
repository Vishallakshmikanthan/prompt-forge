import { Badge } from "@/components/ui/badge";
import { Star, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PromptHeaderProps {
    title: string;
    author: string;
    category: string;
    aiModel: string;
    tags: string[];
    score: number;
    securityWarnings?: string[];
    parentPrompt?: {
        id: string;
        title: string;
    };
}

export function PromptHeader({ title, author, category, aiModel, tags, score, securityWarnings, parentPrompt }: PromptHeaderProps) {
    const hasWarnings = securityWarnings && securityWarnings.length > 0;

    return (
        <div className="flex flex-col gap-4">
            {hasWarnings && (
                <div className="flex gap-3 items-center bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-xl animate-in fade-in slide-in-from-top-4 duration-700">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <div className="text-sm">
                        <p className="font-bold">Security Notice</p>
                        <p className="opacity-90">This prompt contains keywords related to: {securityWarnings.map(w => `"${w}"`).join(", ")}. Use it upon your safety.</p>
                    </div>
                </div>
            )}
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
