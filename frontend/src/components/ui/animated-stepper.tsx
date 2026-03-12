"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedStepperProps {
    steps: string[];
    currentStep: number;
    className?: string;
}

export function AnimatedStepper({
    steps,
    currentStep,
    className,
}: AnimatedStepperProps) {
    return (
        <div className={cn("w-full py-4", className)}>
            <div className="relative flex justify-between">
                {/* Progress Bar Background */}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-zinc-800" />

                {/* Animated Progress Bar */}
                <motion.div
                    className="absolute top-5 left-0 h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    initial={{ width: "0%" }}
                    animate={{
                        width: `${(currentStep / (steps.length - 1)) * 100}%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;

                    return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.2 : 1,
                                    backgroundColor: isCompleted || isActive ? "#06b6d4" : "#27272a",
                                    borderColor: isCompleted || isActive ? "#22d3ee" : "#3f3f46",
                                    boxShadow: isActive ? "0 0 15px rgba(6,182,212,0.6)" : "none",
                                }}
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300",
                                    isActive ? "bg-cyan-500 border-cyan-400" : "bg-zinc-800 border-zinc-700"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-5 w-5 text-zinc-950" />
                                ) : (
                                    <span
                                        className={cn(
                                            "text-sm font-medium",
                                            isActive ? "text-zinc-950" : "text-zinc-400"
                                        )}
                                    >
                                        {index + 1}
                                    </span>
                                )}
                            </motion.div>
                            <motion.span
                                animate={{
                                    color: isActive ? "#22d3ee" : "#71717a",
                                    fontWeight: isActive ? 600 : 400,
                                }}
                                className="mt-2 text-xs uppercase tracking-wider"
                            >
                                {step}
                            </motion.span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
