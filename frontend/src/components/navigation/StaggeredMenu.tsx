"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { X, Github, Linkedin, Twitter } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface StaggeredMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const NAV_ITEMS = [
    { label: "Explore Prompts", link: "/explore", ariaLabel: "Browse prompt marketplace" },
    { label: "Categories", link: "/categories", ariaLabel: "View prompt categories" },
    { label: "Community", link: "/community", ariaLabel: "Community prompts" },
    { label: "Documentation", link: "/docs", ariaLabel: "Read documentation" },
    { label: "API Reference", link: "/api", ariaLabel: "View API reference" },
];

const SOCIAL_LINKS = [
    { icon: Github, label: "GitHub", link: "https://github.com" },
    { icon: Linkedin, label: "LinkedIn", link: "https://linkedin.com" },
    { icon: Twitter, label: "X (Twitter)", link: "https://x.com" },
];

const COLORS = ["#000000", "#111111", "#18181b"];
const ACCENT_COLOR = "#8B5CF6";

export function StaggeredMenu({ isOpen, onClose }: StaggeredMenuProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const layer1Ref = useRef<HTMLDivElement>(null);
    const layer2Ref = useRef<HTMLDivElement>(null);
    const mainPanelRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const socialsRef = useRef<HTMLDivElement>(null);
    const timeline = useRef<any>(null);

    useEffect(() => {
        // Initial state
        gsap.set([layer1Ref.current, layer2Ref.current, mainPanelRef.current], {
            xPercent: 100,
        });
        gsap.set(itemsRef.current, { y: 50, opacity: 0 });
        gsap.set(socialsRef.current, { opacity: 0, y: 20 });
        gsap.set(logoRef.current, { opacity: 0, x: -20 });

        timeline.current = gsap.timeline({ paused: true });

        timeline.current
            .to(layer1Ref.current, {
                xPercent: 0,
                duration: 0.8,
                ease: "power4.inOut",
            })
            .to(
                layer2Ref.current,
                {
                    xPercent: 0,
                    duration: 0.8,
                    ease: "power4.inOut",
                },
                "-=0.6"
            )
            .to(
                mainPanelRef.current,
                {
                    xPercent: 0,
                    duration: 0.8,
                    ease: "power4.inOut",
                },
                "-=0.6"
            )
            .to(
                logoRef.current,
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out",
                },
                "-=0.2"
            )
            .to(
                itemsRef.current,
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                },
                "-=0.4"
            )
            .to(
                socialsRef.current,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                },
                "-=0.3"
            );

        return () => {
            timeline.current?.kill();
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            timeline.current?.play();
        } else {
            document.body.style.overflow = "";
            timeline.current?.reverse();
        }
    }, [isOpen]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "fixed inset-0 z-[100] pointer-events-none overflow-hidden",
                isOpen && "pointer-events-auto"
            )}
        >
            {/* Background Layers */}
            <div
                ref={layer1Ref}
                className="absolute inset-0 z-10"
                style={{ backgroundColor: COLORS[0] }}
            />
            <div
                ref={layer2Ref}
                className="absolute inset-0 z-20"
                style={{ backgroundColor: COLORS[1] }}
            />

            {/* Main Panel */}
            <div
                ref={mainPanelRef}
                className="absolute right-0 inset-y-0 z-30 w-full lg:w-[30vw] flex flex-col p-8 md:p-12 shadow-2xl"
                style={{ backgroundColor: COLORS[2] }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-16">
                    <div ref={logoRef} className="flex items-center space-x-2">
                        <div
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: ACCENT_COLOR }}
                        >
                            P
                        </div>
                        <span className="font-bold text-xl tracking-tight text-zinc-100">
                            PromptForge
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 flex flex-col justify-center space-y-6 md:space-y-8">
                    {NAV_ITEMS.map((item, index) => (
                        <div
                            key={item.label}
                            ref={(el) => { itemsRef.current[index] = el; }}
                            className="overflow-hidden"
                        >
                            <Link
                                href={item.link}
                                aria-label={item.ariaLabel}
                                onClick={onClose}
                                className="group block"
                            >
                                <span className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-100 group-hover:text-[#8B5CF6] transition-colors duration-300">
                                    {item.label}
                                </span>
                                <span className="block h-0.5 w-0 group-hover:w-12 transition-all duration-300 bg-[#8B5CF6] mt-2" />
                            </Link>
                        </div>
                    ))}
                </nav>

                {/* Social Links */}
                <div ref={socialsRef} className="mt-auto border-t border-zinc-800 pt-8">
                    <div className="flex items-center space-x-6">
                        {SOCIAL_LINKS.map((social) => (
                            <a
                                key={social.label}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-[#8B5CF6] transition-colors group flex items-center gap-2"
                            >
                                <social.icon className="h-5 w-5" />
                                <span className="text-sm font-medium hidden sm:inline">
                                    {social.label}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
