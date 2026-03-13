"use client";

import { Sparkles, History, Users, Code2, Cpu, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
    {
        title: "Version Control Built-in",
        description: "Track changes, fork variations, and collaborate on prompts.",
        icon: History,
        learnMoreHref: "/documentation/templates",
        className: "md:col-span-2 md:row-span-2 bg-gradient-to-br from-background to-muted/50",
    },
    {
        title: "Community Driven",
        description: "Access curated prompts from top AI engineers.",
        icon: Users,
        learnMoreHref: "/community",
        className: "md:col-span-1 md:row-span-1 bg-background",
    },
    {
        title: "Discover Proven Prompts",
        description: "Optimized for OpenAI, Anthropic, Gemini, and local models.",
        icon: Cpu,
        learnMoreHref: "/documentation/prompts",
        className: "md:col-span-1 md:row-span-1 bg-background",
    },
    {
        title: "Structured Design",
        description: "Enforce JSON schema directly in the prompt UI.",
        icon: Code2,
        learnMoreHref: "/documentation/templates",
        className: "md:col-span-1 md:row-span-2 bg-gradient-to-tr from-accent/10 to-background",
    },
    {
        title: "Instant Execution",
        description: "Test run prompts immediately with your API keys.",
        icon: Zap,
        learnMoreHref: "/documentation/prompts",
        className: "md:col-span-2 md:row-span-1 bg-background",
    },
    {
        title: "Smart Suggestions",
        description: "AI-assisted prompt optimization for effective instructions.",
        icon: Sparkles,
        learnMoreHref: "/documentation/prompts",
        className: "md:col-span-1 md:row-span-1 bg-background",
    },
];

export function FeaturesSection() {
    return (
        <section className="py-24 relative overflow-hidden bg-background">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 font-display">
                        The Operating System for <span className="text-accent">AI Prompts</span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground whitespace-pre-line">
                        PromptForge provides a complete toolset for software teams to discover, manage, and scale their AI interactions gracefully.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[160px] gap-4 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`rounded-3xl p-6 border border-border/50 hover:border-accent/50 group relative overflow-hidden transition-colors ${feature.className}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="flex flex-col h-full justify-between relative z-10">
                                <div className="w-12 h-12 bg-muted/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                                    <feature.icon className="w-6 h-6 text-foreground group-hover:text-accent transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-semibold mb-2 font-display tracking-tight group-hover:text-accent transition-colors">{feature.title}</h3>
                                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-3">
                                        {feature.description}
                                    </p>
                                    <Link
                                        href={feature.learnMoreHref}
                                        className="text-xs font-semibold text-accent/70 hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        Learn more →
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
