"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import React from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
    ssr: false,
});

interface SplineSceneProps {
    scene: string;
    className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
    return (
        <div
            className={cn(
                "relative w-full h-full min-h-[500px] overflow-hidden",
                className
            )}
        >
            {/* Spline Canvas */}
            <Spline
                scene={scene}
                className="absolute inset-0 w-full h-full"
            />

            {/* Soft vignette overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-40" />
        </div>
    );
}