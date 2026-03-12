"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal } from "lucide-react";
import { AuroraBackground } from "@/components/backgrounds/aurora";
import { TypewriterEffect } from "@/components/animations/typewriter";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
    const words = [
        { text: "Discover" },
        { text: "High-Quality" },
        { text: "AI", className: "text-accent dark:text-accent" },
        { text: "Prompts" },
        { text: "Built" },
        { text: "by" },
        { text: "Developers.", className: "text-accent dark:text-accent" },
    ];

    return (
        <AuroraBackground className="pt-24 pb-32 w-full">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="relative flex flex-col items-center justify-center px-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background/50 backdrop-blur-xl shadow-sm mb-8 hover:bg-muted/50 transition-colors cursor-pointer group">
                    <Terminal className="w-4 h-4 text-accent group-hover:animate-pulse" />
                    <span className="text-sm font-medium tracking-wide">PromptForge Platform</span>
                </div>

                <div className="font-display max-w-4xl mx-auto mb-6 text-center">
                    <TypewriterEffect words={words} className="text-5xl md:text-7xl lg:text-7xl" />
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-center font-light"
                >
                    PromptForge is a curated platform where developers share structured prompts used to build software with AI.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
                >
                    <Link href="/categories">
                        <Button size="lg" className="h-14 px-8 text-base font-semibold group rounded-full bg-accent hover:bg-accent/90 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] transition-all w-full sm:w-auto">
                            Explore Categories
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:scale-110 transition-all" />
                        </Button>
                    </Link>
                    <Link href="/upload">
                        <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold rounded-full border-border hover:bg-muted backdrop-blur-sm transition-all w-full sm:w-auto group">
                            Upload Prompt
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </AuroraBackground>
    );
}
