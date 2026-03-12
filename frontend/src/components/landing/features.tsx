"use client";

import { useRef } from "react";
import { Search, Layout, Users } from "lucide-react";
import { SpiralAnimation } from "@/components/ui/spiral-animation";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue
} from "framer-motion";

function Background() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    const springConfig = { damping: 25, stiffness: 150 };
    const mouseXSpring = useSpring(mouseX, springConfig);
    const mouseYSpring = useSpring(mouseY, springConfig);

    const handleInteraction = (clientX: number, clientY: number) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        mouseX.set((clientX - left) / width);
        mouseY.set((clientY - top) / height);
    };

    const onMouseMove = (e: React.MouseEvent) => handleInteraction(e.clientX, e.clientY);
    const onTouchMove = (e: React.TouchEvent) => handleInteraction(e.touches[0].clientX, e.touches[0].clientY);

    // Scroll-linked transforms
    const blob1Y = useTransform(scrollYProgress, [0, 1], [-150, 150]);
    const blob2Y = useTransform(scrollYProgress, [0, 1], [150, -150]);
    const blob3Scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);

    // Mouse-linked transforms (parallax)
    const mouseXMove = useTransform(mouseXSpring, [0, 1], [-60, 60]);
    const mouseYMove = useTransform(mouseYSpring, [0, 1], [-60, 60]);

    const gridY = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <div
            ref={ref}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
            className="absolute inset-0 z-0"
        >
            {/* Subtle Grid with parallax */}
            <motion.div
                style={{ y: gridY }}
                className="absolute inset-x-0 -inset-y-20 bg-grid-white/[0.02] bg-[size:40px_40px] pointer-events-none"
            />

            {/* Animated Gradient Blobs stimulated by Scroll and Mouse */}
            <motion.div
                style={{
                    x: mouseXMove,
                    y: blob1Y,
                    opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.15, 0.05]),
                }}
                className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-cyan-500/20 blur-[130px] rounded-full pointer-events-none"
            />

            <motion.div
                style={{
                    x: useTransform(mouseXSpring, [0, 1], [60, -60]),
                    y: blob2Y,
                    opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.1, 0.05]),
                }}
                className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-500/20 blur-[130px] rounded-full pointer-events-none"
            />

            <motion.div
                style={{
                    scale: blob3Scale,
                    x: useTransform(mouseXSpring, [0, 1], [-40, 40]),
                    y: mouseYMove,
                    opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.03, 0.08, 0.03]),
                }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[50%] bg-indigo-500/20 blur-[150px] rounded-full pointer-events-none"
            />

            {/* Interacting Light Streaks */}
            <motion.div
                style={{
                    rotate: useTransform(scrollYProgress, [0, 1], [-15, 15]),
                    opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.2, 0]),
                    x: useTransform(mouseXSpring, [0, 1], [-100, 100])
                }}
                className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-md pointer-events-none"
            />
        </div>
    );
}

export function Features() {
    return (
        <section className="relative py-32 bg-zinc-950 overflow-hidden border-y border-zinc-900/30">
            <div className="absolute inset-0 pointer-events-none z-0 opacity-30 md:opacity-40">
                <SpiralAnimation />
            </div>
            <Background />

            <div className="container mx-auto px-6 relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Core Engine</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
                        Platform <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Features</span>
                    </h2>
                    <p className="mt-4 text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                        Everything you need to discover, use, and share high-quality AI prompts
                        in a structured, professional environment.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

                    {/* Card 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl p-10 text-center hover:-translate-y-3 hover:border-cyan-500/40 hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] transition-all duration-500 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-16 h-16 mx-auto mb-8 bg-zinc-800/80 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 relative z-10">
                            <Search className="text-zinc-400 group-hover:text-cyan-400 transition-colors" size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">
                            Discover Proven Prompts
                        </h3>
                        <p className="text-zinc-400 mb-8 leading-relaxed text-base relative z-10">
                            Browse curated prompts used by developers to build real-world AI applications.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm font-bold text-zinc-500 group-hover:text-cyan-400 transition-colors cursor-pointer relative z-10 group/link">
                            Learn More
                            <motion.span
                                animate={{ x: [0, 6, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >→</motion.span>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl p-10 text-center hover:-translate-y-3 hover:border-purple-500/40 hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)] transition-all duration-500 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-16 h-16 mx-auto mb-8 bg-zinc-800/80 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 relative z-10">
                            <Layout className="text-zinc-400 group-hover:text-purple-400 transition-colors" size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">
                            Structured Design
                        </h3>
                        <p className="text-zinc-400 mb-8 leading-relaxed text-base relative z-10">
                            Every prompt follows a structured format ensuring complete reproducibility.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm font-bold text-zinc-500 group-hover:text-purple-400 transition-colors cursor-pointer relative z-10 group/link">
                            Learn More
                            <motion.span
                                animate={{ x: [0, 6, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >→</motion.span>
                        </div>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl p-10 text-center hover:-translate-y-3 hover:border-indigo-500/40 hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] transition-all duration-500 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-16 h-16 mx-auto mb-8 bg-zinc-800/80 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 relative z-10">
                            <Users className="text-zinc-400 group-hover:text-indigo-400 transition-colors" size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">
                            Community Driven
                        </h3>
                        <p className="text-zinc-400 mb-8 leading-relaxed text-base relative z-10">
                            Learn from prompts shared by developers, researchers, and AI builders.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm font-bold text-zinc-500 group-hover:text-indigo-400 transition-colors cursor-pointer relative z-10 group/link">
                            Learn More
                            <motion.span
                                animate={{ x: [0, 6, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >→</motion.span>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
