"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PromptPreviewProps {
    text: string;
    maxLength?: number;
    className?: string;
}

export function PromptPreview({ text, maxLength = 250, className }: PromptPreviewProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const isTruncated = text.length > maxLength;
    const displayText = isExpanded ? text : (isTruncated ? `${text.slice(0, maxLength)}...` : text);

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div className="relative">
                <p className="font-mono text-sm text-muted-foreground whitespace-pre-wrap rounded-md bg-muted/40 p-3 border border-border/50">
                    {displayText}
                </p>
            </div>
            {isTruncated && (
                <button
                    onClick={(e) => {
                        e.preventDefault(); // Prevent linking if inside a link wrapper
                        e.stopPropagation(); // Prevent card clicks
                        setIsExpanded(!isExpanded);
                    }}
                    className="flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors w-fit"
                >
                    {isExpanded ? (
                        <>Show less <ChevronUp className="ml-1 w-3 h-3" /></>
                    ) : (
                        <>See more <ChevronDown className="ml-1 w-3 h-3" /></>
                    )}
                </button>
            )}
        </div>
    );
}
