"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import {
    Zap,
    Layers,
    Tag,
    GitFork,
    Layout,
    Flame,
    ShieldCheck,
    BarChart2
} from "lucide-react";
import { InteractiveRobotSpline, InteractiveRobotRef } from "@/components/ui/interactive-3d-robot";

const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

const features = [
    {
        id: "optimization",
        label: "Advanced Optimization",
        icon: Zap,
        desktopPos: "lg:top-[10%] lg:left-[8%]",
        tabletPos: "md:top-[15%] md:left-[2%]",
        mobilePos: "hidden md:flex",
    },
    {
        id: "safety",
        label: "Execution Safety",
        icon: ShieldCheck,
        desktopPos: "lg:top-[40%] lg:left-[2%]",
        tabletPos: "md:top-[45%] md:left-0",
        mobilePos: "top-[20%] left-[5%]",
    },
    {
        id: "branching",
        label: "Branching Paths",
        icon: GitFork,
        desktopPos: "lg:top-[70%] lg:left-[12%]",
        tabletPos: "md:top-[75%] md:left-[8%]",
        mobilePos: "top-[60%] left-[10%]",
    },
    {
        id: "keyword",
        label: "Keyword Enhancer",
        icon: Tag,
        desktopPos: "lg:bottom-[0%] lg:left-[28%]",
        tabletPos: "md:bottom-[-5%] md:left-[22%]",
        mobilePos: "hidden md:flex",
    },
    {
        id: "templates",
        label: "Prompt Templates",
        icon: Layout,
        desktopPos: "lg:bottom-[0%] lg:right-[28%]",
        tabletPos: "md:bottom-[-5%] md:right-[22%]",
        mobilePos: "hidden md:flex",
    },
    {
        id: "system",
        label: "System Design",
        icon: Layers,
        desktopPos: "lg:top-[70%] lg:right-[12%]",
        tabletPos: "md:top-[75%] md:right-[8%]",
        mobilePos: "top-[60%] right-[10%]",
    },
    {
        id: "experimentation",
        label: "Live Experimentation",
        icon: Flame,
        desktopPos: "lg:top-[40%] lg:right-[2%]",
        tabletPos: "md:top-[45%] md:right-0",
        mobilePos: "top-[20%] right-[5%]",
    },
    {
        id: "statistics",
        label: "Community Metrics",
        icon: BarChart2,
        desktopPos: "lg:top-[10%] lg:right-[8%]",
        tabletPos: "md:top-[15%] md:right-[2%]",
        mobilePos: "hidden md:flex",
    },
];

export function CategoriesSection() {
    const robotRef = useRef<InteractiveRobotRef>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleBubbleHover = (e: React.MouseEvent) => {
        if (!containerRef.current || !robotRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Robot is roughly in the center of the container
        const robotCenterX = rect.width / 2;
        const robotCenterY = rect.height / 2;

        const bubbleRect = e.currentTarget.getBoundingClientRect();
        const bubbleCenterX = bubbleRect.left - rect.left + bubbleRect.width / 2;
        const bubbleCenterY = bubbleRect.top - rect.top + bubbleRect.height / 2;

        const dx = bubbleCenterX - robotCenterX;
        const dy = bubbleCenterY - robotCenterY;

        // Normalize vector roughly (-1 to 1 based on half limits)
        const normX = dx / (rect.width / 2);
        const normY = dy / (rect.height / 2);

        robotRef.current.setTargetDirection(normX, normY);
    };

    return (
        <section className="relative min-h-[600px] md:min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black overflow-hidden border-y border-zinc-900 pt-10 md:pt-20 pb-8 md:pb-12">
            <ShaderAnimation />

            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 h-full flex flex-col items-center">

                {/* Hero Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center space-y-1.5 lg:space-y-2 z-20 relative"
                >
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                        PromptForge
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.1]">
                        Your AI Prompt Companion
                    </h2>
                    <p className="text-[10px] sm:text-xs md:text-sm text-zinc-400 max-w-sm md:max-w-md mx-auto leading-relaxed font-medium">
                        PromptForge helps developers discover, share and improve AI prompts used in real-world applications.
                    </p>
                </motion.div>

                {/* U-Shaped Interactive Area */}
                <div
                    ref={containerRef}
                    className="relative w-full max-w-5xl mt-10 md:mt-24 h-[300px] md:h-[500px] lg:h-[600px] flex items-center justify-center"
                >
                    {/* Centered Robot */}
                    {!isMobile && (
                        <div className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none hidden md:flex">
                            <div className="w-[320px] h-[320px] md:w-[420px] md:h-[420px] lg:w-[520px] lg:h-[520px] pointer-events-auto">
                                <InteractiveRobotSpline
                                    ref={robotRef}
                                    scene={ROBOT_SCENE_URL}
                                    className="w-full h-full"
                                />
                            </div>
                        </div>
                    )}

                    {/* Surrounding Interactive Bubbles */}
                    {features.map((feature) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.08 }}
                            onMouseEnter={handleBubbleHover}
                            onMouseLeave={() => robotRef.current?.resetDirection()}
                            className={`absolute flex flex-col items-center justify-center cursor-pointer 
                                w-[75px] h-[75px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px] 
                                rounded-full bg-[rgba(25,25,30,0.85)] backdrop-blur-md border border-white/10 
                                transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:border-indigo-400/50
                                group z-10 ${feature.mobilePos} ${feature.tabletPos} ${feature.desktopPos}`}
                        >
                            <feature.icon className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 mb-1 md:mb-2 text-indigo-400 group-hover:text-indigo-300 transition-colors drop-shadow-md" />
                            <span className="text-[8px] md:text-[10px] lg:text-xs font-semibold text-center leading-tight text-white/90 px-2 lg:px-4 group-hover:text-white transition-colors">
                                {feature.label}
                            </span>
                        </motion.div>
                    ))}
                    
                    {isMobile && (
                         <div className="md:hidden flex flex-col items-center justify-center text-zinc-500 gap-2 mt-8">
                             <Zap className="w-8 h-8 opacity-20" />
                             <span className="text-[10px] uppercase tracking-widest opacity-50">Interactive Experience on Desktop</span>
                         </div>
                    )}
                </div>
            </div>
        </section>
    );
}
