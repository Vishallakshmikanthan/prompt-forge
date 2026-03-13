"use client";

import { CategoryGrid } from "@/components/categories/category-grid";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { statsService, type CategoryStat } from "@/lib/services/statsService";

export default function CategoriesPage() {
    const [stats, setStats] = useState<CategoryStat[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await statsService.getCategoryStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch category stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <main className="flex min-h-screen flex-col bg-black pb-24">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="container relative z-10 mx-auto px-6 pt-32">
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group text-sm font-medium"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="mb-16">
                    <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
                        Explore Domains
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                        Prompt Categories
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
                        Explore high-quality AI prompts organized by domain and use case. 
                        Find the perfect starting point for your next project.
                    </p>
                </div>

                <CategoryGrid categoryStats={stats} />
            </div>
        </main>
    );
}
