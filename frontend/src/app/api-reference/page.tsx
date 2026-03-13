"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Lock, Database, User, BarChart2, Copy, CheckCircle2 } from "lucide-react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface Endpoint {
    method: HttpMethod;
    path: string;
    description: string;
    params?: { name: string; type: string; required: boolean; desc: string }[];
    response: object;
}

interface ApiGroup {
    id: string;
    label: string;
    icon: any;
    description: string;
    endpoints: Endpoint[];
}

const methodColors: Record<HttpMethod, string> = {
    GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    POST: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    PUT: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
};

const apiGroups: ApiGroup[] = [
    {
        id: "auth",
        label: "Authentication",
        icon: Lock,
        description: "Endpoints for user authentication and session management.",
        endpoints: [
            {
                method: "POST", path: "/api/auth/login",
                description: "Authenticates a user with email and password. Returns a session token.",
                params: [
                    { name: "email", type: "string", required: true, desc: "User email address" },
                    { name: "password", type: "string", required: true, desc: "User password (min 8 chars)" },
                ],
                response: { success: true, data: { token: "eyJhbGci...", user: { id: "uuid", email: "user@example.com" } } },
            },
            {
                method: "POST", path: "/api/auth/register",
                description: "Creates a new user account with email, password, and optional username.",
                params: [
                    { name: "email", type: "string", required: true, desc: "Unique email address" },
                    { name: "password", type: "string", required: true, desc: "Password (min 8 chars)" },
                    { name: "username", type: "string", required: false, desc: "Optional display username" },
                ],
                response: { success: true, data: { user: { id: "uuid", email: "user@example.com", created_at: "2024-01-01" } } },
            },
            {
                method: "POST", path: "/api/auth/google",
                description: "OAuth login via Google. Returns redirect URL for the OAuth flow.",
                response: { success: true, data: { url: "https://accounts.google.com/o/oauth2/..." } },
            },
        ],
    },
    {
        id: "prompts",
        label: "Prompts",
        icon: Database,
        description: "CRUD operations for managing AI prompts.",
        endpoints: [
            {
                method: "GET", path: "/api/prompts",
                description: "Returns a paginated list of prompts. Supports filtering by category, sort, and search.",
                params: [
                    { name: "page", type: "number", required: false, desc: "Page number (default: 1)" },
                    { name: "limit", type: "number", required: false, desc: "Results per page (default: 20, max: 100)" },
                    { name: "category", type: "string", required: false, desc: "Filter by category slug" },
                    { name: "sort", type: "string", required: false, desc: "Sort by: trending | newest | top" },
                    { name: "q", type: "string", required: false, desc: "Search query string" },
                ],
                response: { success: true, data: [{ id: "uuid", title: "Code Reviewer", category: "code", votes: 42 }], total: 120, page: 1 },
            },
            {
                method: "POST", path: "/api/prompts",
                description: "Creates a new prompt. Requires authentication.",
                params: [
                    { name: "title", type: "string", required: true, desc: "Prompt title" },
                    { name: "description", type: "string", required: true, desc: "Short description" },
                    { name: "content", type: "string", required: true, desc: "The prompt body text" },
                    { name: "category", type: "string", required: true, desc: "Category slug" },
                    { name: "model", type: "string", required: false, desc: "Target model (gpt-4, claude-3, etc.)" },
                    { name: "tags", type: "string[]", required: false, desc: "Array of tag strings" },
                ],
                response: { success: true, data: { id: "uuid", title: "My Prompt", slug: "my-prompt", created_at: "2024-01-01" } },
            },
            {
                method: "GET", path: "/api/prompts/{id}",
                description: "Returns a single prompt by ID with full details, author info, and engagement stats.",
                response: { success: true, data: { id: "uuid", title: "Code Reviewer", content: "Review the following code...", votes: 42, views: 1200, author: { username: "devuser" } } },
            },
            {
                method: "PUT", path: "/api/prompts/{id}",
                description: "Updates an existing prompt. Only the author can update their own prompt.",
                params: [
                    { name: "title", type: "string", required: false, desc: "Updated title" },
                    { name: "content", type: "string", required: false, desc: "Updated prompt body" },
                    { name: "description", type: "string", required: false, desc: "Updated description" },
                ],
                response: { success: true, data: { id: "uuid", title: "Updated Prompt", updated_at: "2024-01-02" } },
            },
            {
                method: "DELETE", path: "/api/prompts/{id}",
                description: "Deletes a prompt permanently. Only the author or admin can delete.",
                response: { success: true, message: "Prompt deleted successfully" },
            },
        ],
    },
    {
        id: "profile",
        label: "Profile",
        icon: User,
        description: "User profile data retrieval and update endpoints.",
        endpoints: [
            {
                method: "GET", path: "/api/profile",
                description: "Returns the authenticated user's profile including bio, stats, and published prompts.",
                response: { success: true, data: { username: "devuser", bio: "AI enthusiast", prompts_count: 12, bookmarks_count: 34 } },
            },
            {
                method: "PUT", path: "/api/profile/update",
                description: "Updates the authenticated user's profile fields.",
                params: [
                    { name: "username", type: "string", required: false, desc: "New display username" },
                    { name: "bio", type: "string", required: false, desc: "Profile bio (max 200 chars)" },
                    { name: "avatar_url", type: "string", required: false, desc: "URL to profile avatar image" },
                ],
                response: { success: true, data: { username: "newname", bio: "Updated bio" } },
            },
        ],
    },
    {
        id: "analytics",
        label: "Analytics",
        icon: BarChart2,
        description: "Retrieve engagement metrics and activity data for the authenticated user.",
        endpoints: [
            {
                method: "GET", path: "/api/profile/activity",
                description: "Returns recent activity events for the authenticated user (views, votes, forks received).",
                response: { success: true, data: [{ type: "view", prompt_id: "uuid", timestamp: "2024-01-01T10:00:00Z" }] },
            },
            {
                method: "GET", path: "/api/profile/stats",
                description: "Returns aggregated statistics for the user's published prompts.",
                response: { success: true, data: { totalViews: 1240, totalVotes: 98, totalForks: 14, totalBookmarks: 203 } },
            },
        ],
    },
];

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="p-1.5 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
        >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
    );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-border/50 rounded-xl overflow-hidden bg-card mb-4">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors text-left"
            >
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono border ${methodColors[endpoint.method]}`}>{endpoint.method}</span>
                <code className="font-mono text-sm text-foreground flex-1">{endpoint.path}</code>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
            </button>
            {open && (
                <div className="border-t border-border/50 p-5 space-y-5">
                    <p className="text-muted-foreground text-sm">{endpoint.description}</p>
                    {endpoint.params && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Request Parameters</p>
                            <div className="rounded-lg overflow-hidden border border-border/50">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border/50 bg-muted/30">
                                            <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Name</th>
                                            <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Type</th>
                                            <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Required</th>
                                            <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {endpoint.params.map((p) => (
                                            <tr key={p.name} className="border-b border-border/30 last:border-0">
                                                <td className="py-2 px-3 font-mono text-xs text-accent">{p.name}</td>
                                                <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{p.type}</td>
                                                <td className="py-2 px-3 text-xs">{p.required ? <span className="text-red-400">Yes</span> : <span className="text-muted-foreground">No</span>}</td>
                                                <td className="py-2 px-3 text-xs text-muted-foreground">{p.desc}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Example Response</p>
                            <CopyButton value={JSON.stringify(endpoint.response, null, 2)} />
                        </div>
                        <pre className="rounded-lg bg-muted/30 border border-border/50 p-4 text-xs font-mono text-muted-foreground overflow-x-auto">
                            <code>{JSON.stringify(endpoint.response, null, 2)}</code>
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ApiReferencePage() {
    const [activeGroup, setActiveGroup] = useState("auth");
    const group = apiGroups.find((g) => g.id === activeGroup) || apiGroups[0];

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border/50 bg-card/30 py-10">
                <div className="container mx-auto px-4 max-w-7xl">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href="/documentation" className="hover:text-foreground transition-colors">Documentation</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-foreground">API Reference</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight font-display mb-2">API Reference</h1>
                        <p className="text-muted-foreground text-lg">Complete documentation for all PromptForge API endpoints.</p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl py-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-56 shrink-0">
                        <div className="sticky top-24 space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-2">API Groups</p>
                            {apiGroups.map((g) => (
                                <button
                                    key={g.id}
                                    onClick={() => setActiveGroup(g.id)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeGroup === g.id
                                        ? "bg-accent/10 text-accent border border-accent/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        }`}
                                >
                                    <g.icon className="w-4 h-4" />
                                    {g.label}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="flex-1 min-w-0">
                        <motion.div
                            key={activeGroup}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <group.icon className="w-5 h-5 text-accent" />
                                </div>
                                <h2 className="text-2xl font-bold">{group.label} API</h2>
                            </div>
                            <p className="text-muted-foreground text-sm mb-6">{group.description}</p>

                            <div className="mb-4 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex items-start gap-3">
                                <Lock className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                                <p className="text-sm text-muted-foreground">
                                    All API requests must include a valid <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">Authorization: Bearer &lt;token&gt;</code> header
                                    except for public endpoints (GET prompts list, GET single prompt).
                                </p>
                            </div>

                            {group.endpoints.map((ep, i) => (
                                <EndpointCard key={i} endpoint={ep} />
                            ))}
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
}
