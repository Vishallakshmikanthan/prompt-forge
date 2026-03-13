"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, GitFork, ChevronRight, Users, Code2, Layers, ShieldCheck, Zap, BookOpen, Terminal } from "lucide-react";

const repos = [
    {
        name: "promptforge/platform",
        description: "The main PromptForge web platform — a community-driven prompt discovery and management system for AI engineers.",
        features: [
            "Semantic prompt search with AI embeddings",
            "Real-time version control and forking",
            "Community voting and analytics",
            "Structured prompt templates with typed variables",
            "OAuth authentication via Google & email",
        ],
        tech: ["Next.js 14", "TypeScript", "TailwindCSS", "Supabase", "Prisma", "Node.js"],
        stars: 1284,
        forks: 143,
        contributors: 8,
        license: "MIT",
    },
    {
        name: "promptforge/backend",
        description: "RESTful API backend powering the PromptForge platform with analytics, recommendations, and version management.",
        features: [
            "Prompt CRUD with versioning support",
            "Analytics engine for engagement metrics",
            "AI-powered recommendation system",
            "Rate limiting and security middleware",
            "Comprehensive API documentation",
        ],
        tech: ["Node.js", "Express", "TypeScript", "PostgreSQL", "Prisma ORM", "Redis"],
        stars: 678,
        forks: 71,
        contributors: 5,
        license: "MIT",
    },
    {
        name: "promptforge/sdk",
        description: "Official TypeScript/JavaScript SDK for integrating PromptForge into your applications.",
        features: [
            "Full TypeScript typings",
            "React and Next.js first-class hooks",
            "Edge-compatible runtime",
            "Streaming response support",
            "Prompt template execution",
        ],
        tech: ["TypeScript", "Rollup", "Vitest", "tsx"],
        stars: 423,
        forks: 38,
        contributors: 3,
        license: "Apache 2.0",
    },
];

const architecture = [
    { layer: "Frontend", tech: "Next.js + TailwindCSS", desc: "App router, SSR/CSR hybrid rendering, shadcn/ui component library, Framer Motion animations." },
    { layer: "Backend API", tech: "Node.js + Express", desc: "RESTful API with TypeScript, rate limiting, JWT validation, input sanitization, and structured error responses." },
    { layer: "Database", tech: "PostgreSQL + Prisma", desc: "Relational database managed via Prisma ORM. Migrations tracked in the repository." },
    { layer: "Auth", tech: "Supabase Auth", desc: "OAuth via Google, email/password login, and session token management via Supabase's auth module." },
    { layer: "Storage", tech: "Supabase Storage", desc: "User avatar uploads and prompt media assets stored in Supabase buckets." },
];

export default function GithubPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border/50 bg-card/30 py-12">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground">GitHub</span>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                                <Terminal className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight font-display">PromptForge</h1>
                                <p className="text-muted-foreground text-sm">Open-source repositories</p>
                            </div>
                        </div>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Explore the repositories that power the PromptForge platform. All core repositories are open-source under the MIT license.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl py-10 space-y-12">
                {/* Repository Cards */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 tracking-tight">Repositories</h2>
                    <div className="space-y-5">
                        {repos.map((repo, i) => (
                            <motion.div
                                key={repo.name}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="border border-border/50 rounded-2xl bg-card hover:border-accent/30 transition-all overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Code2 className="w-4 h-4 text-accent" />
                                                <h3 className="font-bold text-lg text-accent font-mono">{repo.name}</h3>
                                            </div>
                                            <p className="text-muted-foreground text-sm max-w-xl">{repo.description}</p>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                <Star className="w-4 h-4 text-yellow-400" />
                                                <span className="font-semibold">{repo.stars.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                <GitFork className="w-4 h-4" />
                                                <span className="font-semibold">{repo.forks}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                <Users className="w-4 h-4" />
                                                <span className="font-semibold">{repo.contributors}</span>
                                            </div>
                                            <span className="text-xs px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground">{repo.license}</span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Key Features</p>
                                            <ul className="space-y-1.5">
                                                {repo.features.map(f => (
                                                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                        <Zap className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Tech Stack</p>
                                            <div className="flex flex-wrap gap-2">
                                                {repo.tech.map(t => (
                                                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 font-mono">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Project Overview / README Preview */}
                <section className="border border-border/50 rounded-2xl bg-card overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-muted/30">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">README.md</span>
                    </div>
                    <div className="p-6 space-y-8">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Project Overview</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                PromptForge is an open-source platform designed to solve the growing challenge of prompt management in AI-powered development.
                                As AI is integrated deeper into software workflows, teams need a structured, collaborative way to discover, version, and share the prompts
                                that drive their applications. PromptForge provides exactly that — think of it as GitHub for AI prompts.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-3">Architecture</h3>
                            <div className="space-y-3">
                                {architecture.map((a) => (
                                    <div key={a.layer} className="flex gap-4 p-4 rounded-xl border border-border/30 bg-background">
                                        <div className="w-28 shrink-0">
                                            <p className="font-semibold text-sm">{a.layer}</p>
                                            <p className="text-xs text-accent font-mono mt-0.5">{a.tech}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-3">Contribution Guidelines</h3>
                            <div className="space-y-2">
                                {[
                                    "Fork the repository and create your feature branch from main.",
                                    "Write clear commit messages following the Conventional Commits specification.",
                                    "Add or update tests for any new functionality.",
                                    "Ensure all linting and type checks pass before submitting a PR.",
                                    "Open a pull request with a detailed description of your changes.",
                                    "Participate in code review; all PRs require at least one approving review.",
                                ].map((guideline, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <span className="font-mono text-xs text-accent mt-0.5 shrink-0">{(i + 1).toString().padStart(2, '0')}</span>
                                        {guideline}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                            <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
                            <p className="text-sm text-muted-foreground">
                                All repositories are licensed under MIT or Apache 2.0. Contributions are welcome and encouraged.
                                Please read the full CONTRIBUTING.md before opening a pull request.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
