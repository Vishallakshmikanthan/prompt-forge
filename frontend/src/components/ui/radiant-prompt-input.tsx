"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface RadiantPromptInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function RadiantPromptInput({
    value,
    onChange,
    onSubmit,
    placeholder = "Search for AI prompts...",
    className,
}: RadiantPromptInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && onSubmit) {
            onSubmit(value);
        }
    };

    return (
        <div className={cn("relative w-full max-w-2xl mx-auto", className)}>
            {/* Radiant Gradient Border */}
            <motion.div
                animate={{
                    opacity: isFocused ? 1 : 0.4,
                    scale: isFocused ? 1.01 : 1,
                }}
                className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 opacity-40 blur-sm transition-all duration-300"
            />

            <div className="relative flex items-center rounded-xl bg-zinc-950 px-4 py-3 shadow-2xl">
                <div className="flex items-center justify-center mr-3 text-zinc-500">
                    {isFocused ? (
                        <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
                    ) : (
                        <Search className="h-5 w-5" />
                    )}
                </div>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="flex-1 bg-transparent text-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
                    placeholder={placeholder}
                />

                <div className="flex items-center gap-2">
                    <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-1.5 font-mono text-[10px] font-medium text-zinc-500 opacity-100 uppercase">
                        <span className="text-xs">Enter</span>
                    </kbd>
                </div>
            </div>

            {/* Focus Indicator Underline */}
            <motion.div
                initial={false}
                animate={{
                    width: isFocused ? "100%" : "0%",
                }}
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
            />
        </div>
    );
}
