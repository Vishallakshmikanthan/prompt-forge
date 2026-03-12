"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface LuminousSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
    disabled?: boolean;
}

export function LuminousSwitch({
    checked,
    onChange,
    className,
    disabled = false,
}: LuminousSwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
            className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50",
                checked ? "bg-cyan-500/20" : "bg-zinc-800",
                className
            )}
        >
            {/* Glow Effect */}
            <AnimatePresence>
                {checked && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 rounded-full bg-cyan-500/30 blur-md"
                    />
                )}
            </AnimatePresence>

            <div
                className={cn(
                    "absolute inset-0 rounded-full border transition-all duration-300",
                    checked ? "border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]" : "border-zinc-700"
                )}
            />

            <motion.span
                initial={false}
                animate={{
                    x: checked ? 20 : 0,
                    backgroundColor: checked ? "#22d3ee" : "#a1a1aa",
                    boxShadow: checked ? "0 0 15px rgba(34,211,238,0.8)" : "none",
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                }}
                className={cn(
                    "pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform"
                )}
            />
        </button>
    );
}
