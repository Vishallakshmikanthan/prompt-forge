"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollSequenceCanvasProps {
    sequencePath: string;
    framePattern?: (index: number) => string;
    maxFrames?: number; // Optional fail-safe bound
    startIndex?: number; // Added to handle array off-by-one sequence patterns
}

export function ScrollSequenceCanvas({
    sequencePath,
    framePattern = (index) => `frame_${index.toString().padStart(4, "0")}.webp`,
    maxFrames = 1000,
    startIndex = 1,
}: ScrollSequenceCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [detectedFrames, setDetectedFrames] = useState(0);
    const imagesRef = useRef<HTMLImageElement[]>([]);

    // Custom frame object that GSAP will scrub
    const frameObj = useRef({ current: 0 });

    // 1. Dynamic Sequential Preload Images
    useEffect(() => {
        const images: HTMLImageElement[] = [];

        const loadFrame = (index: number) => {
            // Fail-safe
            if (index > maxFrames) {
                imagesRef.current = images;
                setDetectedFrames(images.length);
                setImagesLoaded(true);
                return;
            }

            const img = new Image();
            // construct the src without double slash if sequencePath is empty
            const slash = sequencePath ? "/" : "";
            img.src = `${sequencePath}${slash}${framePattern(index)}`;

            img.onload = () => {
                images.push(img);
                loadFrame(index + 1); // Probe next frame sequentially
            };

            img.onerror = () => {
                // We reached the end of the naturally available sequence
                imagesRef.current = images;
                setDetectedFrames(images.length);
                setImagesLoaded(true);
            };
        };

        // Start loading from the specified start index
        loadFrame(startIndex);
    }, [sequencePath, framePattern, maxFrames, startIndex]);

    // 2. Setup Canvas, GSAP ScrollTrigger, and Render Loop
    useEffect(() => {
        if (!imagesLoaded || detectedFrames === 0 || !canvasRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false }); // Optimize if no transparency needed
        if (!ctx) return;

        // Helper to render current frame preserving aspect ratio (object-fit: cover)
        const renderFrame = (index: number) => {
            // Safely clamp index
            const safeIndex = Math.min(Math.max(0, Math.floor(index)), detectedFrames - 1);
            const img = imagesRef.current[safeIndex];

            if (!img || !img.complete || img.naturalWidth === 0) return;

            const cw = canvas.width;
            const ch = canvas.height;
            const iw = img.width;
            const ih = img.height;

            const scale = Math.max(cw / iw, ch / ih);
            const x = (cw / 2) - (iw / 2) * scale;
            const y = (ch / 2) - (ih / 2) * scale;

            ctx.fillRect(0, 0, cw, ch); // Clear background
            ctx.drawImage(img, x, y, iw * scale, ih * scale);
        };

        // Resize handler
        const handleResize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                renderFrame(frameObj.current.current);
            }
        };

        handleResize(); // Initial sizing
        window.addEventListener("resize", handleResize);

        // Initial draw
        renderFrame(0);

        // Setup GSAP
        const trigger = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "+=2000",
            pin: true,
            scrub: 1, // Add slight smoothing to scrub
            onUpdate: (self) => {
                // Map progress (0-1) to dynamically detected frame index
                frameObj.current.current = self.progress * (detectedFrames - 1);

                // Use requestAnimationFrame for smooth painting decoupling logic from scroll event
                requestAnimationFrame(() => renderFrame(frameObj.current.current));
            }
        });

        return () => {
            window.removeEventListener("resize", handleResize);
            trigger.kill();
        };
    }, [imagesLoaded, detectedFrames]);

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
            <canvas
                ref={canvasRef}
                className="block w-full h-full object-cover"
            />

            {!imagesLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
            )}
        </div>
    );
}
