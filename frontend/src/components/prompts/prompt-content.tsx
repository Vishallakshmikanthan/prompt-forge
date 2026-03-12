"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptContentProps {
    content: string;
}

export function PromptContent({ content }: PromptContentProps) {
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Check if content naturally exceeds a reasonable height (~300px)
    // We mock this by checking character count for simplicity right now
    const isLongContent = content.length > 500;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <div className="relative group rounded-xl border bg-muted/30 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Prompt Content
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={handleCopy}
                    title="Copy to clipboard"
                >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>

            <div className={cn(
                "relative transition-all duration-500 ease-in-out font-mono text-sm leading-relaxed p-6",
                !isExpanded && isLongContent ? "max-h-[300px] overflow-hidden" : "max-h-[2000px]"
            )}>
                <pre className="whitespace-pre-wrap break-words font-mono text-foreground/90">
                    {content}
                </pre>

                {/* Fade out effect when collapsed */}
                {!isExpanded && isLongContent && (
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-muted/80 to-transparent flex items-end justify-center pb-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full shadow-sm backdrop-blur-sm"
                            onClick={() => setIsExpanded(true)}
                        >
                            Show More
                            <ChevronDown className="ml-1.5 h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Collapse button when expanded */}
            {isExpanded && isLongContent && (
                <div className="flex justify-center p-4 border-t bg-muted/20">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setIsExpanded(false)}
                    >
                        Show Less
                        <ChevronUp className="ml-1.5 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
