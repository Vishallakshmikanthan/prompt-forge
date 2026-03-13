"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";

export function Magnetic({ children, pullStrength = 0.35, elasticReturn = true }: { children: React.ReactElement, pullStrength?: number, elasticReturn?: boolean }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const xTo = gsap.quickTo(ref.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(ref.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const mouseMove = (e: MouseEvent) => {
            if (!ref.current) return;
            const { clientX, clientY } = e;
            const { height, width, left, top } = ref.current.getBoundingClientRect();
            const x = (clientX - (left + width / 2)) * pullStrength;
            const y = (clientY - (top + height / 2)) * pullStrength;
            xTo(x);
            yTo(y);
        };

        const mouseLeave = () => {
            if (elasticReturn) {
                gsap.to(ref.current, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
            } else {
                xTo(0);
                yTo(0);
            }
        };

        // Capture ref value to avoid React warning about unmounting with changed ref
        const currentRef = ref.current;

        if (currentRef) {
            currentRef.addEventListener("mousemove", mouseMove);
            currentRef.addEventListener("mouseleave", mouseLeave);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener("mousemove", mouseMove);
                currentRef.removeEventListener("mouseleave", mouseLeave);
            }
        };
    }, [pullStrength, elasticReturn]);

    return (
        <motion.div
            ref={ref}
            className="inline-block"
            initial={false}
        >
            {children}
        </motion.div>
    );
}
