"use client";

import { useState, KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface TagInputProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    maxTags?: number;
}

export function TagInput({ tags, onTagsChange, maxTags = 5 }: TagInputProps) {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newTag = inputValue.trim().toLowerCase();

            if (newTag && !tags.includes(newTag) && tags.length < maxTags) {
                onTagsChange([...tags, newTag]);
            }
            setInputValue("");
        } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
            e.preventDefault();
            const newTags = [...tags];
            newTags.pop();
            onTagsChange(newTags);
        }
    };

    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 p-2 min-h-12 border rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                {tags.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1.5 text-sm"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="rounded-full hover:bg-muted p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <X className="w-3 h-3" />
                            <span className="sr-only">Remove {tag} tag</span>
                        </button>
                    </Badge>
                ))}

                <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length < maxTags ? "Add tags (press Enter)..." : ""}
                    disabled={tags.length >= maxTags}
                    className="flex-1 border-0 h-auto p-0 shadow-none focus-visible:ring-0 min-w-[120px] bg-transparent text-sm"
                />
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
                <span>Separate tags with Enter or comma</span>
                <span>{tags.length}/{maxTags} tags</span>
            </div>
        </div>
    );
}
