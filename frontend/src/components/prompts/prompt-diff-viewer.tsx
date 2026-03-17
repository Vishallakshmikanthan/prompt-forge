"use client";

import { useMemo } from "react";
import { diffWords } from "diff";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { type PromptVersion } from "@/lib/services/versionService";

interface PromptDiffViewerProps {
    versionA: PromptVersion;
    versionB: PromptVersion;
    onRestore?: (versionId: string) => Promise<void>;
    isRestoring?: string | null; // versionId currently being restored
}

export function PromptDiffViewer({ versionA, versionB, onRestore, isRestoring }: PromptDiffViewerProps) {
    // Compute word-level diff from A → B
    const differences = useMemo(
        () => diffWords(versionA.promptContent, versionB.promptContent),
        [versionA.promptContent, versionB.promptContent]
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Left column — Version A (older / "from") */}
            <div className="flex flex-col gap-3 border rounded-xl p-4 bg-card">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <span className="text-sm font-semibold">
                            Version {versionA.versionNumber}
                        </span>
                        <span className="ml-3 text-xs text-muted-foreground">
                            {format(new Date(versionA.createdAt), "MMM d, yyyy · HH:mm")}
                        </span>
                    </div>
                    {onRestore && (
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={isRestoring === versionA.id}
                            onClick={() => onRestore(versionA.id)}
                        >
                            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                            {isRestoring === versionA.id ? "Restoring…" : "Restore this version"}
                        </Button>
                    )}
                </div>

                <div className="rounded-lg bg-muted/30 border p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                    {differences.map((part, index) => {
                        if (part.removed) {
                            return (
                                <span key={index} className="bg-red-100 text-red-800 line-through dark:bg-red-900/40 dark:text-red-300">
                                    {part.value}
                                </span>
                            );
                        }
                        if (part.added) {
                            // Added parts belong to B — skip in A column
                            return null;
                        }
                        return <span key={index}>{part.value}</span>;
                    })}
                </div>
            </div>

            {/* Right column — Version B (newer / "to") */}
            <div className="flex flex-col gap-3 border rounded-xl p-4 bg-card">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <span className="text-sm font-semibold">
                            Version {versionB.versionNumber}
                        </span>
                        <span className="ml-3 text-xs text-muted-foreground">
                            {format(new Date(versionB.createdAt), "MMM d, yyyy · HH:mm")}
                        </span>
                    </div>
                    {onRestore && (
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={isRestoring === versionB.id}
                            onClick={() => onRestore(versionB.id)}
                        >
                            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                            {isRestoring === versionB.id ? "Restoring…" : "Restore this version"}
                        </Button>
                    )}
                </div>

                <div className="rounded-lg bg-muted/30 border p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                    {differences.map((part, index) => {
                        if (part.added) {
                            return (
                                <span key={index} className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                                    {part.value}
                                </span>
                            );
                        }
                        if (part.removed) {
                            // Removed parts belong to A — skip in B column
                            return null;
                        }
                        return <span key={index}>{part.value}</span>;
                    })}
                </div>
            </div>
        </div>
    );
}
