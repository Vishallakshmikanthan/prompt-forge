"use client"

import { useEffect } from "react"
import { ReactLenis, useLenis } from "@studio-freight/react-lenis"

export function LenisProvider({ children }: { children: React.ReactNode }) {
    const lenis = useLenis(({ scroll }) => {
        // Optional: add custom scroll listeners here if needed later
    })

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {children as any}
        </ReactLenis>
    )
}
