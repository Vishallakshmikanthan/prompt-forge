"use client";

import { motion } from "framer-motion";
import { Code, Bot, Bug, Layout, Terminal, Paintbrush } from "lucide-react";

export function PromptTypes() {
    const categories = [
        { name: "Web Development", icon: <Code className="w-6 h-6" />, count: "120+ Prompts", color: "text-blue-500", bg: "bg-blue-500/10" },
        { name: "AI Agents", icon: <Bot className="w-6 h-6" />, count: "85+ Prompts", color: "text-purple-500", bg: "bg-purple-500/10" },
        { name: "Debugging", icon: <Bug className="w-6 h-6" />, count: "64+ Prompts", color: "text-red-500", bg: "bg-red-500/10" },
        { name: "Architecture", icon: <Layout className="w-6 h-6" />, count: "42+ Prompts", color: "text-orange-500", bg: "bg-orange-500/10" },
        { name: "DevOps", icon: <Terminal className="w-6 h-6" />, count: "56+ Prompts", color: "text-green-500", bg: "bg-green-500/10" },
        { name: "UI Generation", icon: <Paintbrush className="w-6 h-6" />, count: "93+ Prompts", color: "text-pink-500", bg: "bg-pink-500/10" },
    ];

    return (
        <section className="py-24 px-4 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Prompt Categories</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Find the exact prompt you need from our curated collection.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="flex items-center gap-4 p-6 rounded-2xl border border-border bg-background hover:border-accent/50 hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className={`p-4 rounded-xl ${category.bg} ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                                {category.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">{category.name}</h3>
                                <p className="text-sm text-muted-foreground">{category.count}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
