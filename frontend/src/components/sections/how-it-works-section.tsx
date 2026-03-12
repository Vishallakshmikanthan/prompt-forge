"use client";

import React, { useState } from "react";
import { Code, Search, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const steps = [
    {
        id: "discover",
        title: "Explore Prompts",
        description: "Browse prompts organized by categories to find exactly what you need.",
        icon: Search,
    },
    {
        id: "build",
        title: "Learn & Build",
        description: "Use prompts to accelerate AI-assisted development and build faster.",
        icon: Code,
    },
    {
        id: "share",
        title: "Share Prompts",
        description: "Contribute prompts and help the developer community by sharing.",
        icon: Share2,
    },
];

export function HowItWorksSection() {
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);

    return (
        <section className="py-[120px] px-[32px] relative overflow-hidden bg-background">
            <div className="max-w-[1200px] mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-[80px]"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 font-display">
                        How PromptForge Works
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        A seamless experience designed to boost your productivity with AI.
                    </p>
                </motion.div>

                {/* Linear Flow Area */}
                <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full max-w-5xl mx-auto gap-4 md:gap-2 lg:gap-6 relative z-10">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            {/* Node */}
                            <motion.div
                                initial={{ scale: 0.7, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: index * 0.3,
                                    duration: 0.5
                                }}
                                onHoverStart={() => setHoveredNode(index)}
                                onHoverEnd={() => setHoveredNode(null)}
                                className="flex flex-col items-center text-center w-full md:w-[280px] shrink-0 group cursor-pointer"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.15 }}
                                    transition={{ duration: 0.2 }}
                                    className={cn(
                                        "w-[64px] h-[64px] rounded-full bg-zinc-900 flex items-center justify-center z-10 shadow-lg transition-all duration-300 mb-6",
                                        hoveredNode === index
                                            ? "border border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                            : "border border-[rgba(255,255,255,0.08)] shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                                    )}
                                >
                                    <step.icon className={cn(
                                        "w-7 h-7 transition-colors duration-300",
                                        hoveredNode === index ? "text-purple-300" : "text-purple-400"
                                    )} />
                                </motion.div>

                                <h3 className={cn(
                                    "text-xl font-bold mb-3 font-display transition-colors duration-300",
                                    hoveredNode === index ? "text-purple-400" : "text-white"
                                )}>
                                    {step.title}
                                </h3>
                                <p className="text-zinc-400 text-sm max-w-[240px] leading-relaxed transition-colors duration-300">
                                    {step.description}
                                </p>
                            </motion.div>

                            {/* Connector (Desktop) */}
                            {index < steps.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.3 + 0.2, duration: 0.8 }}
                                    className="hidden md:flex flex-1 relative h-[64px] items-center justify-center min-w-[60px] max-w-[120px] shrink overflow-visible"
                                >
                                    {/* The track */}
                                    <div className="w-full h-[2px] bg-[rgba(255,255,255,0.08)] relative flex items-center rounded-l-full overflow-hidden mr-[2px]">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/30 to-purple-500/10 w-full" />

                                        {/* Flowing Dots */}
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-[4px] h-[4px] rounded-full bg-purple-400 absolute shadow-[0_0_8px_#a855f7]"
                                                style={{ left: 0, top: "50%", marginTop: "-2px" }}
                                                animate={{ left: ["-10%", "110%"] }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                    delay: i * (1.5 / 3) // Evens out the spreading
                                                }}
                                            />
                                        ))}
                                    </div>
                                    {/* Arrowhead */}
                                    <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-[rgba(255,255,255,0.15)] border-b-[4px] border-b-transparent shrink-0" />
                                </motion.div>
                            )}

                            {/* Connector (Mobile) */}
                            {index < steps.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.3 + 0.2, duration: 0.8 }}
                                    className="flex md:hidden flex-col relative w-[64px] h-[40px] my-4 items-center justify-center shrink overflow-visible"
                                >
                                    {/* The track */}
                                    <div className="h-full w-[2px] bg-[rgba(255,255,255,0.08)] relative flex justify-center rounded-t-full overflow-hidden mb-[2px]">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/30 to-purple-500/10 h-full" />

                                        {/* Flowing Dots */}
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-[4px] h-[4px] rounded-full bg-purple-400 absolute shadow-[0_0_8px_#a855f7]"
                                                style={{ top: 0, left: "50%", marginLeft: "-2px" }}
                                                animate={{ top: ["-10%", "110%"] }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                    delay: i * (1.5 / 3)
                                                }}
                                            />
                                        ))}
                                    </div>
                                    {/* Arrowhead */}
                                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-t-[6px] border-t-[rgba(255,255,255,0.15)] border-r-[4px] border-r-transparent shrink-0" />
                                </motion.div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}
