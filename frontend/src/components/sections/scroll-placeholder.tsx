"use client";

import { ScrollSequenceCanvas } from "@/components/animation/scroll-sequence-canvas";

export function ScrollPlaceholder() {
    return (
        <section className="relative w-full bg-black border-y border-white/10">
            {/* 
        This wrapper is needed if we want overlays on top of the pinned canvas.
        ScrollSequenceCanvas pins itself for the duration.
      */}
            <div className="relative z-0">
                <ScrollSequenceCanvas
                    sequencePath=""
                    framePattern={() => ""}
                />
            </div>

            {/* Overlay content positioned absolute to float over the pinned canvas */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                        Master the Machine
                    </h2>
                    <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto drop-shadow-md">
                        The power of structured prompts visually dissected.
                    </p>
                </div>
            </div>
        </section>
    );
}
