"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryCardProps {
    name: string;
    description: string;
    count: number;
    icon: LucideIcon;
    slug: string;
}

export function CategoryCard({ name, description, count, icon: Icon, slug }: CategoryCardProps) {
    const href = `/explore?category=${slug}`;

    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <Link href={href} className="block group">
                <Card className="h-full bg-zinc-900/50 backdrop-blur-sm border-zinc-800 group-hover:border-indigo-500/50 transition-all duration-500 overflow-hidden relative">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500" />
                    
                    <CardContent className="p-6 flex flex-col items-start relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                            <Icon className="w-6 h-6 text-indigo-400" />
                        </div>
                        
                        <div className="mb-4">
                            <h3 className="font-bold text-xl text-white mb-2 group-hover:text-indigo-300 transition-colors">{name}</h3>
                            <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors line-clamp-2 leading-relaxed">
                                {description}
                            </p>
                        </div>
                        
                        <div className="mt-auto w-full flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-500 bg-zinc-800/50 px-2.5 py-1 rounded-full border border-zinc-700/50">
                                {count} Prompts
                            </span>
                            
                            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                EXPLORE <ArrowRight size={14} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}
