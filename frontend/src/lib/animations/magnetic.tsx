"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

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

    // Use a custom string if the children is a string to prevent cloneElement issues, 
    // though the typing expects a ReactElement.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return React.cloneElement(children as React.ReactElement<any>, {
        ref: (node: HTMLDivElement) => {
            // Forward ref back to our internal ref
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (ref as any).current = node;

            // Chain to existing ref if possible
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const childRef = (children as any).ref;
            if (typeof childRef === "function") {
                childRef(node);
            } else if (childRef && "current" in childRef) {
                // eslint-disable-next-line
                childRef.current = node;
            }
        }
    });
}
