"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const MODELS = ["GPT", "Claude", "Gemini", "Cursor", "Antigravity"];

interface CategoryFiltersProps {
    availableTags: string[];
    selectedModel: string | null;
    onModelChange: (model: string | null) => void;
    selectedTags: string[];
    onTagToggle: (tag: string) => void;
    sortBy: "latest" | "most_upvoted" | "highest_score";
    onSortChange: (sort: "latest" | "most_upvoted" | "highest_score") => void;
}

export function CategoryFilters({
    availableTags,
    selectedModel,
    onModelChange,
    selectedTags,
    onTagToggle,
    sortBy,
    onSortChange
}: CategoryFiltersProps) {
    return (
        <div className="flex flex-col gap-6 mb-8 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar w-full sm:w-auto">
                    <Button
                        variant={selectedModel === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => onModelChange(null)}
                        className="rounded-full shrink-0"
                    >
                        All Models
                    </Button>
                    {MODELS.map(model => (
                        <Button
                            key={model}
                            variant={selectedModel === model ? "default" : "outline"}
                            size="sm"
                            onClick={() => onModelChange(model)}
                            className="rounded-full shrink-0"
                        >
                            {model}
                        </Button>
                    ))}
                </div>

                <div className="shrink-0">
                    <Select value={sortBy} onValueChange={(v) => onSortChange(v as "latest" | "most_upvoted" | "highest_score")}>
                        <SelectTrigger className="w-[180px] h-9 rounded-full">
                            <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="latest">Latest</SelectItem>
                            <SelectItem value="most_upvoted">Most Upvoted</SelectItem>
                            <SelectItem value="highest_score">Highest Score</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {availableTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground mr-2 font-medium">Keywords:</span>
                    {availableTags.map(tag => (
                        <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? "default" : "secondary"}
                            className="cursor-pointer hover:bg-primary/80 transition-colors"
                            onClick={() => onTagToggle(tag)}
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
