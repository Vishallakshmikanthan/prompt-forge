"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    BookOpen, Rocket, Lightbulb, Layers, Users, BarChart2, FolderOpen,
    ChevronRight, Search, Code2, Zap, Terminal, ArrowRight
} from "lucide-react";

const sections = [
    {
        id: "introduction",
        icon: BookOpen,
        label: "Introduction",
        title: "Welcome to PromptForge Documentation",
        content: (
            <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed text-base">
                    PromptForge is the premier platform for developers, AI engineers, and prompt designers to discover,
                    share, and continuously improve structured AI prompts. Whether you&apos;re building LLM-powered applications
                    or optimizing your workflow, PromptForge gives you the tools to manage prompts like professional code.
                </p>
                <p className="text-muted-foreground leading-relaxed text-base">
                    This documentation covers everything from getting started with your first prompt to advanced techniques
                    for prompt engineering and platform integration.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {[
                        { icon: Rocket, title: "Quick Start", desc: "Get up and running in minutes" },
                        { icon: Layers, title: "Core Concepts", desc: "Learn the fundamentals" },
                        { icon: Code2, title: "API Docs", desc: "Integrate with your stack" },
                    ].map((card) => (
                        <div key={card.title} className="border border-border/50 rounded-xl p-4 bg-card hover:border-accent/40 transition-colors group cursor-pointer">
                            <card.icon className="w-6 h-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                            <h4 className="font-semibold mb-1">{card.title}</h4>
                            <p className="text-sm text-muted-foreground">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        id: "getting-started",
        icon: Rocket,
        label: "Getting Started",
        title: "Getting Started with PromptForge",
        content: (
            <div className="space-y-6">
                {[
                    {
                        step: "01", title: "Create Your Account",
                        desc: "Sign up using your email or Google account. Your account gives you access to all platform features including bookmarks, uploads, and community participation.",
                    },
                    {
                        step: "02", title: "Explore Prompt Categories",
                        desc: "Browse curated categories including Code Generation, Data Extraction, Creative Writing, and more. Each category features a feed of community-ranked prompts.",
                    },
                    {
                        step: "03", title: "Upload Your First Prompt",
                        desc: "Navigate to the upload page and fill in the prompt title, description, model target, and the prompt body. Add tags to help others discover your work.",
                    },
                    {
                        step: "04", title: "Bookmark & Build Collections",
                        desc: "Bookmark prompts that you find useful. Access your bookmarks from your profile to build a personal library of go-to prompts.",
                    },
                ].map((item) => (
                    <div key={item.step} className="flex gap-4 p-5 rounded-xl border border-border/50 bg-card hover:border-accent/30 transition-colors">
                        <span className="text-4xl font-black text-accent/20 font-display shrink-0">{item.step}</span>
                        <div>
                            <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: "prompt-engineering",
        icon: Lightbulb,
        label: "Prompt Engineering",
        title: "Prompt Engineering Guides",
        content: (
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">What is Prompt Engineering?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        Prompt engineering is the practice of crafting inputs to AI language models to achieve specific,
                        reliable outcomes. Unlike traditional programming, prompt engineering relies on natural language
                        patterns, careful instruction design, and iterative refinement to shape model behavior.
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Best Prompt Design Practices</h3>
                    <ul className="space-y-3">
                        {[
                            "Be explicit about the desired output format (JSON, Markdown, plain text).",
                            "Provide context and role specification at the start of your prompt.",
                            "Use few-shot examples to demonstrate expected behavior.",
                            "Decompose complex tasks into sequential steps.",
                            "Include negative examples to prevent common failure modes.",
                        ].map((tip) => (
                            <li key={tip} className="flex items-start gap-3 text-muted-foreground text-sm">
                                <ChevronRight className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Prompt Optimization Techniques</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { name: "Chain-of-Thought", desc: "Guide the model to reason step-by-step before answering." },
                            { name: "Self-Consistency", desc: "Generate multiple outputs and pick the most consistent answer." },
                            { name: "ReAct Pattern", desc: "Combine reasoning with actionable tool calls in a loop." },
                            { name: "Structured Outputs", desc: "Force the model to respond in a defined schema for reliability." },
                        ].map((tech) => (
                            <div key={tech.name} className="border border-border/50 rounded-lg p-4 bg-card">
                                <p className="font-semibold mb-1 text-accent">{tech.name}</p>
                                <p className="text-sm text-muted-foreground">{tech.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "platform-features",
        icon: Layers,
        label: "Platform Features",
        title: "Platform Features",
        content: (
            <div className="space-y-6">
                {[
                    {
                        icon: Search, title: "Prompt Discovery",
                        desc: "Use semantic search powered by AI embeddings to find prompts by concept, not just keywords. Filter by category, model type, star rating, and recency.",
                    },
                    {
                        icon: Layers, title: "Structured Prompt Templates",
                        desc: "PromptForge supports parameterized templates with typed variable slots. Define reusable prompt skeletons and fill them with runtime data using our SDK.",
                    },
                    {
                        icon: Users, title: "Community Collaboration",
                        desc: "Fork prompts from other creators, suggest improvements, and engage in community discussions. Our community feedback loop continuously improves prompt quality.",
                    },
                ].map((feat) => (
                    <div key={feat.title} className="flex gap-4 p-5 rounded-xl border border-border/50 bg-card hover:border-accent/30 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                            <feat.icon className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">{feat.title}</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: "developer-guides",
        icon: Terminal,
        label: "Developer Guides",
        title: "Developer Guides",
        content: (
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-semibold mb-3">Using Prompt Analytics</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        Track how your prompts perform in the wild. Analytics include view counts, bookmark rates, vote scores,
                        fork counts, and engagement over time. Access analytics from your profile dashboard.
                    </p>
                    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50 bg-muted/30">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                            </div>
                            <span className="text-xs font-mono text-muted-foreground ml-2">analytics.ts</span>
                        </div>
                        <pre className="p-4 text-sm font-mono text-muted-foreground overflow-x-auto">
                            <code>{`// Fetch analytics for a prompt
const response = await fetch('/api/profile/stats');
const stats = await response.json();

// stats.data = {
//   totalViews: 1240,
//   totalVotes: 98,
//   totalForks: 14,
//   totalBookmarks: 203
// }`}</code>
                        </pre>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-3">Building Prompt Collections</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Organize your prompts into thematic collections using bookmarks and profile sections. Collections
                        help teams standardize AI interactions by maintaining a shared library of approved, version-controlled prompts.
                    </p>
                    <div className="flex gap-3 mt-4 flex-wrap">
                        {["REST API", "TypeScript SDK", "Webhooks", "CLI Tool"].map((tag) => (
                            <span key={tag} className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-mono border border-accent/20">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "analytics",
        icon: BarChart2,
        label: "Analytics",
        title: "Analytics & Metrics",
        content: (
            <div className="space-y-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                    PromptForge provides deep analytics so you can understand your prompt performance and community engagement.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Views", icon: "👁️", desc: "Total prompt views" },
                        { label: "Votes", icon: "⬆️", desc: "Community upvotes" },
                        { label: "Forks", icon: "🍴", desc: "Times forked" },
                        { label: "Bookmarks", icon: "🔖", desc: "User saves" },
                    ].map((metric) => (
                        <div key={metric.label} className="border border-border/50 rounded-xl p-4 bg-card text-center">
                            <div className="text-2xl mb-1">{metric.icon}</div>
                            <p className="font-semibold text-sm">{metric.label}</p>
                            <p className="text-xs text-muted-foreground mt-1">{metric.desc}</p>
                        </div>
                    ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Access your analytics via the <Link href="/profile" className="text-accent hover:underline">Profile Dashboard</Link> or
                    via the <Link href="/api-reference" className="text-accent hover:underline">Analytics API endpoints</Link>.
                </p>
            </div>
        ),
    },
    {
        id: "collections",
        icon: FolderOpen,
        label: "Collections",
        title: "Prompt Collections",
        content: (
            <div className="space-y-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Prompt collections allow you to group related prompts into thematic libraries accessible from your profile.
                </p>
                <div className="space-y-3">
                    {[
                        { name: "Bookmarks", desc: "Save any prompt to your personal bookmark library for quick access." },
                        { name: "Forked Prompts", desc: "When you fork a prompt, it becomes a personal copy you can edit and improve." },
                        { name: "Published Prompts", desc: "Your public prompts appear on your profile and in community search results." },
                    ].map((item) => (
                        <div key={item.name} className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-card">
                            <Zap className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                            <div>
                                <p className="font-medium text-sm mb-0.5">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
];

export default function DocumentationPage() {
    const [activeSection, setActiveSection] = useState("introduction");

    const current = sections.find((s) => s.id === activeSection) || sections[0];

    return (
        <div className="min-h-screen bg-background">
            {/* Page header */}
            <div className="border-b border-border/50 bg-card/30 py-10">
                <div className="container mx-auto px-4 max-w-7xl">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-foreground">Documentation</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight font-display mb-2">
                            Documentation
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Everything you need to get the most from PromptForge.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl py-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="sticky top-24 space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-2">Contents</p>
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === section.id
                                            ? "bg-accent/10 text-accent border border-accent/20"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        }`}
                                >
                                    <section.icon className="w-4 h-4 shrink-0" />
                                    {section.label}
                                </button>
                            ))}

                            <div className="mt-6 pt-6 border-t border-border/50">
                                <Link href="/api-reference">
                                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                                        <Code2 className="w-4 h-4" />
                                        API Reference →
                                    </div>
                                </Link>
                                <Link href="/community">
                                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                                        <Users className="w-4 h-4" />
                                        Community →
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 min-w-0">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <current.icon className="w-5 h-5 text-accent" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">{current.title}</h2>
                            </div>
                            <div className="prose-sm max-w-none">
                                {current.content}
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between mt-10 pt-6 border-t border-border/50">
                                {sections.findIndex(s => s.id === activeSection) > 0 && (
                                    <button
                                        onClick={() => {
                                            const idx = sections.findIndex(s => s.id === activeSection);
                                            setActiveSection(sections[idx - 1].id);
                                        }}
                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        ← Previous
                                    </button>
                                )}
                                <div className="ml-auto">
                                    {sections.findIndex(s => s.id === activeSection) < sections.length - 1 && (
                                        <button
                                            onClick={() => {
                                                const idx = sections.findIndex(s => s.id === activeSection);
                                                setActiveSection(sections[idx + 1].id);
                                            }}
                                            className="flex items-center gap-2 text-sm text-accent hover:opacity-80 transition-colors"
                                        >
                                            Next <ArrowRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
}
