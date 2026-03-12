"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface FlipCardProps {
    children: React.ReactNode;
    layoutId: string;
    className?: string;
}

export function FlipCard({ children, layoutId, className }: FlipCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layoutId={layoutId}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={cn("relative will-change-transform", className)}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        layoutId={`${layoutId}-hoverbg`}
                        className="absolute inset-0 bg-accent/5 rounded-2xl md:rounded-3xl z-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                )}
            </AnimatePresence>
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </motion.div>
    );
}
