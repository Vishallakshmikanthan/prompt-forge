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

export function HowItWorks() {
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);

    return (
        <section className="py-[120px] px-[32px] relative overflow-hidden bg-background">
            <div className="max-w-[1200px] mx-auto text-center relative z-10">
                {/* Background ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[300px] bg-purple-500/5 blur-[120px] pointer-events-none rounded-full" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-[100px]"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 font-display">
                        How <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">PromptForge</span> Works
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        A seamless experience designed to boost your productivity with AI.
                    </p>
                </motion.div>

                {/* Linear Flow Area */}
                <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full max-w-5xl mx-auto md:gap-[40px] lg:gap-[60px] relative z-10">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            {/* Node Container */}
                            <motion.div
                                initial={{ scale: 0.6, opacity: 0, y: 20 }}
                                whileInView={{ scale: 1, opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20,
                                    delay: index * 0.4,
                                }}
                                onHoverStart={() => setHoveredNode(index)}
                                onHoverEnd={() => setHoveredNode(null)}
                                className="flex flex-col items-center text-center w-[220px] md:w-[260px] shrink-0 group cursor-pointer relative"
                            >
                                {/* Glowing backdrop for node */}
                                <motion.div
                                    className="absolute top-[36px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] bg-purple-500/20 blur-[30px] rounded-full pointer-events-none transition-all duration-500"
                                    animate={{
                                        scale: hoveredNode === index ? 1.5 : [1, 1.2, 1],
                                        opacity: hoveredNode === index ? 0.8 : [0.4, 0.6, 0.4]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.5
                                    }}
                                />

                                <motion.div
                                    whileHover={{ scale: 1.1, translateY: -5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    className={cn(
                                        "w-[76px] h-[76px] rounded-[24px] rotate-3 hover:rotate-0 bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center z-10 shadow-xl transition-all duration-500 mb-8 overflow-hidden relative",
                                        hoveredNode === index
                                            ? "border border-purple-400/50 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                                            : "border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                                    )}
                                >
                                    {/* Shimmer sweep effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />

                                    <div className={cn(
                                        "p-2 rounded-xl transition-colors duration-500",
                                        hoveredNode === index ? "bg-purple-500/10" : "bg-transparent"
                                    )}>
                                        <step.icon className={cn(
                                            "w-8 h-8 transition-all duration-500",
                                            hoveredNode === index ? "text-purple-300 scale-110" : "text-zinc-400"
                                        )} />
                                    </div>
                                </motion.div>

                                <motion.h3
                                    className={cn(
                                        "text-2xl font-bold mb-3 font-display transition-colors duration-500",
                                        hoveredNode === index ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-500" : "text-white"
                                    )}
                                >
                                    {step.title}
                                </motion.h3>

                                <p className="text-zinc-400 text-[15px] leading-[1.6] max-w-[240px] transition-colors duration-500 group-hover:text-zinc-300">
                                    {step.description}
                                </p>
                            </motion.div>

                            {/* Connector (Desktop) */}
                            {index < steps.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0, scaleX: 0 }}
                                    whileInView={{ opacity: 1, scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: index * 0.4 + 0.3,
                                        duration: 0.8,
                                        ease: "circOut"
                                    }}
                                    className="hidden md:flex flex-1 relative h-[76px] items-center justify-center min-w-[80px] max-w-[140px] shrink origin-left overflow-visible -mt-8"
                                >
                                    {/* Track container */}
                                    <div className="w-full h-[3px] bg-white/[0.03] backdrop-blur-sm relative flex items-center rounded-l-full overflow-hidden mr-[2px]">

                                        {/* Shooting Comet 1 */}
                                        <motion.div
                                            className="absolute h-full w-[60px] bg-gradient-to-r from-transparent via-purple-500/50 to-purple-400"
                                            style={{ left: "-40%", top: 0 }}
                                            animate={{ left: ["-50%", "150%"] }}
                                            transition={{
                                                duration: 2.5,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                        >
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[4px] h-[4px] bg-white rounded-full shadow-[0_0_12px_#c084fc,0_0_20px_#c084fc]" />
                                        </motion.div>

                                        {/* Shooting Comet 2 (Delayed) */}
                                        <motion.div
                                            className="absolute h-full w-[60px] bg-gradient-to-r from-transparent via-indigo-500/50 to-indigo-400"
                                            style={{ left: "-40%", top: 0 }}
                                            animate={{ left: ["-50%", "150%"] }}
                                            transition={{
                                                duration: 2.5,
                                                repeat: Infinity,
                                                ease: "linear",
                                                delay: 1.25,
                                            }}
                                        >
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[4px] h-[4px] bg-white rounded-full shadow-[0_0_12px_#818cf8,0_0_20px_#818cf8]" />
                                        </motion.div>
                                    </div>

                                    {/* Glowing Arrowhead */}
                                    <motion.div
                                        className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-purple-500/40 border-b-[5px] border-b-transparent shrink-0 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                                        animate={{
                                            borderLeftColor: ["rgba(168,85,247,0.2)", "rgba(168,85,247,0.8)", "rgba(168,85,247,0.2)"]
                                        }}
                                        transition={{
                                            duration: 2.5,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    />
                                </motion.div>
                            )}

                            {/* Connector (Mobile) */}
                            {index < steps.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0, scaleY: 0 }}
                                    whileInView={{ opacity: 1, scaleY: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: index * 0.4 + 0.3,
                                        duration: 0.8,
                                        ease: "circOut"
                                    }}
                                    className="flex md:hidden flex-col relative w-[76px] h-[60px] my-6 items-center justify-center shrink origin-top overflow-visible"
                                >
                                    <div className="h-full w-[3px] bg-white/[0.03] relative flex justify-center rounded-t-full overflow-hidden mb-[2px]">

                                        {/* Vertical Shooting Comet */}
                                        <motion.div
                                            className="absolute w-full h-[40px] bg-gradient-to-b from-transparent via-purple-500/50 to-purple-400"
                                            style={{ top: "-40%" }}
                                            animate={{ top: ["-50%", "150%"] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                        >
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[4px] h-[4px] bg-white rounded-full shadow-[0_0_12px_#c084fc,0_0_20px_#c084fc]" />
                                        </motion.div>

                                        <motion.div
                                            className="absolute w-full h-[40px] bg-gradient-to-b from-transparent via-indigo-500/50 to-indigo-400"
                                            style={{ top: "-40%" }}
                                            animate={{ top: ["-50%", "150%"] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "linear",
                                                delay: 1,
                                            }}
                                        >
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[4px] h-[4px] bg-white rounded-full shadow-[0_0_12px_#818cf8,0_0_20px_#818cf8]" />
                                        </motion.div>
                                    </div>

                                    {/* Mobile Arrowhead */}
                                    <motion.div
                                        className="w-0 h-0 border-l-[5px] border-l-transparent border-t-[8px] border-t-purple-500/40 border-r-[5px] border-r-transparent shrink-0 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                                        animate={{
                                            borderTopColor: ["rgba(168,85,247,0.2)", "rgba(168,85,247,0.8)", "rgba(168,85,247,0.2)"]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    />
                                </motion.div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            {/* CSS for shimmer effect inside node */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite linear;
                }
                `
            }} />
        </section>
    );
}
