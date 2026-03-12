"use client";

import React from "react";
import { motion } from "framer-motion";
import { DotGlobeHero } from "@/components/ui/globe-hero";
import { ArrowRight, Zap } from "lucide-react";

export default function GlobeHeroPromptForge() {
    return (
        <DotGlobeHero rotationSpeed={0.004}>
            <div className="text-center space-y-10 max-w-4xl mx-auto px-6">

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold"
                >
                    Start Exploring
                    <span className="block bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        Developer Prompts
                    </span>
                </motion.h1>

                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Join the community of developers who use PromptForge to build
                    better AI software faster.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground"
                    >
                        Browse Categories
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3 px-8 py-4 border rounded-xl"
                    >
                        <Zap className="w-5 h-5" />
                        Upload Prompt
                    </motion.button>

                </div>
            </div>
        </DotGlobeHero>
    );
}
