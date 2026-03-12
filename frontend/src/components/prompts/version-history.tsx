"use client";

import { useState, useEffect } from "react";
import { versionService, type PromptVersion } from "@/lib/services/versionService";
import { motion, AnimatePresence } from "framer-motion";
import { History, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VersionHistoryProps {
    promptId: string;
}

export function VersionHistory({ promptId }: VersionHistoryProps) {
    const [versions, setVersions] = useState<PromptVersion[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchVersions() {
            try {
                const data = await versionService.getPromptVersions(promptId);
                setVersions(data);
            } catch (error) {
                console.error("Failed to fetch versions:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchVersions();
    }, [promptId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="h-6 w-6 rounded-full border-2 border-accent border-r-transparent animate-spin"></div>
            </div>
        );
    }

    if (versions.length === 0) return null;

    return (
        <Card className="overflow-hidden bg-background/50 border-muted/20 backdrop-blur-sm">
            <div className="p-4 border-b border-muted/20 flex items-center gap-2 bg-muted/10">
                <History className="w-4 h-4 text-accent" />
                <h3 className="font-semibold">Version History</h3>
            </div>
            <div className="divide-y divide-muted/10">
                {versions.map((version) => (
                    <div key={version.id} className="group">
                        <button
                            onClick={() => setExpandedId(expandedId === version.id ? null : version.id)}
                            className="w-full text-left p-4 hover:bg-muted/5 transition-colors flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-xs ring-1 ring-accent/20">
                                    V{version.versionNumber}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">Historical Revision</span>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        {format(new Date(version.createdAt), "MMM d, yyyy • HH:mm")}
                                    </div>
                                </div>
                            </div>
                            {expandedId === version.id ? (
                                <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                            )}
                        </button>
                        <AnimatePresence>
                            {expandedId === version.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden bg-muted/5"
                                >
                                    <div className="p-4 pt-0">
                                        <div className="p-4 rounded-lg bg-background/80 border text-sm font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
                                            {version.promptContent}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </Card>
    );
}
