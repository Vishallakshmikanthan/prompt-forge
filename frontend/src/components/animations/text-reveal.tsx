"use client"

import { FC, ReactNode, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextRevealCardProps {
    text: string
    revealText: string
    children?: ReactNode
    className?: string
}

export const TextRevealCard: FC<TextRevealCardProps> = ({
    text,
    revealText,
    children,
    className,
}) => {
    const widthPercentage = 50

    return (
        <div
            className={cn(
                "bg-[#1d1c20] border border-white/[0.08] w-full rounded-3xl p-8 relative overflow-hidden",
                className
            )}
        >
            {children}

            <div className="h-40 relative flex items-center overflow-hidden">
                <motion.div
                    style={{ width: `${widthPercentage}%` }}
                    className="absolute bg-[#1d1c20] z-20 will-change-transform"
                >
                    <p
                        style={{ textShadow: "4px 4px 15px rgba(0,0,0,0.5)" }}
                        className="text-base sm:text-[3rem] py-10 font-bold text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-300"
                    >
                        {revealText}
                    </p>
                </motion.div>
                <motion.div className="overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]">
                    <p className="text-base sm:text-[3rem] py-10 font-bold bg-clip-text text-transparent bg-[#323238]">
                        {text}
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export const TextRevealByWord = ({
    text,
    className,
}: {
    text: string
    className?: string
}) => {
    const targetRef = useRef<HTMLDivElement | null>(null)

    const { scrollYProgress } = useScroll({
        target: targetRef,
    })
    const words = text.split(" ")

    return (
        <div ref={targetRef} className={cn("relative z-0 h-[200vh]", className)}>
            <div className={"sticky top-0 mx-auto flex h-[50%] max-w-4xl items-center bg-transparent px-[1rem] py-[5rem]"}>
                <p className={"flex flex-wrap text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl lg:leading-tight"}>
                    {words.map((word, i) => {
                        const start = i / words.length
                        const end = start + 1 / words.length
                        return (
                            <Word key={i} progress={scrollYProgress} range={[start, end]}>
                                {word}
                            </Word>
                        )
                    })}
                </p>
            </div>
        </div>
    )
}

const Word = ({
    children,
    progress,
    range,
}: {
    children: ReactNode
    progress: any
    range: [number, number]
}) => {
    const opacity = useTransform(progress, range, [0, 1])
    return (
        <span className="xl:lg-3 relative mx-1 lg:mx-2.5">
            <span className={"absolute opacity-30 dark:text-gray-600 text-gray-300"}>{children}</span>
            <motion.span style={{ opacity: opacity }} className={"text-black dark:text-white"}>
                {children}
            </motion.span>
        </span>
    )
}
