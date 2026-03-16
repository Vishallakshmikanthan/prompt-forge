"use client";

import React from "react";
import { motion } from "framer-motion";
import { DotGlobeHero } from "@/components/ui/globe-hero";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";

export default function GlobeHeroPromptForge() {
    const { user } = useAuth();

    return (
        <DotGlobeHero rotationSpeed={0.004}>
            <div className="text-center space-y-8 md:space-y-10 max-w-4xl mx-auto px-4 md:px-6">

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl sm:text-4xl md:text-7xl font-bold"
                >
                    Start Exploring
                    <span className="block bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        Developer Prompts
                    </span>
                </motion.h1>

                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                    Join the community of developers who use PromptForge to build
                    better AI software faster.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">

                    <Link href="/categories" className="block w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-primary/25 transition-all w-full justify-center"
                        >
                            Browse Categories
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>

                    <Link href={user ? "/upload" : "/login"} className="block w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 px-8 py-4 border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm rounded-xl hover:bg-zinc-900 transition-colors font-semibold w-full justify-center"
                        >
                            <Zap className="w-5 h-5 text-indigo-400" />
                            Upload Prompt
                        </motion.button>
                    </Link>

                </div>
            </div>
        </DotGlobeHero>
    );
}
