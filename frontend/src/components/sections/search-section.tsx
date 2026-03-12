"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

export function SearchSection() {
    return (
        <section className="py-12 bg-muted/30 border-b">
            <div className="container mx-auto px-4 max-w-4xl">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                        if (query.trim()) {
                            window.location.href = `/search?q=${encodeURIComponent(query)}`;
                        }
                    }}
                    className="bg-background relative flex items-center w-full h-14 rounded-2xl border shadow-sm px-4 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                >
                    <Search className="w-5 h-5 text-muted-foreground mr-3" />
                    <Input
                        name="search"
                        type="text"
                        placeholder="Search prompts by keyword, use case, or model..."
                        className="flex-grow border-0 focus-visible:ring-0 shadow-none px-0 text-base bg-transparent h-full"
                    />
                    <div className="flex items-center gap-2 pl-3 border-l ml-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="sr-only">Filters</span>
                        </Button>
                        <Button type="submit" size="sm" className="hidden sm:flex rounded-full px-6">
                            Search
                        </Button>
                    </div>
                </form>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium mr-2">Popular:</span>
                    <button
                        onClick={() => window.location.href = '/search?q=React'}
                        className="hover:text-primary transition-colors"
                    >
                        React
                    </button>
                    <span>•</span>
                    <button
                        onClick={() => window.location.href = '/search?q=System Prompt'}
                        className="hover:text-primary transition-colors"
                    >
                        System Prompt
                    </button>
                    <span>•</span>
                    <button
                        onClick={() => window.location.href = '/search?q=Data Analysis'}
                        className="hover:text-primary transition-colors"
                    >
                        Data Analysis
                    </button>
                </div>
            </div>
        </section>
    );
}
