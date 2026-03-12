"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CategorySearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export function CategorySearch({ searchTerm, onSearchChange }: CategorySearchProps) {
    return (
        <div className="w-full max-w-2xl mx-auto mb-8 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input
                type="text"
                placeholder="Search prompts in this category..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 h-14 rounded-2xl border-muted bg-background shadow-sm hover:border-primary/50 focus-visible:ring-primary focus-visible:border-primary transition-all text-base"
            />
        </div>
    );
}
