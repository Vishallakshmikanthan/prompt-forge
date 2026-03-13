"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, ThumbsUp, TrendingUp, Plus, ChevronRight, Flame, Clock, Hash, Loader2 } from "lucide-react";
import { discussionService, type DiscussionThread } from "@/lib/services/discussionService";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/components/auth/auth-provider";
import { toast } from "sonner";
import { statsService, type CommunityStats } from "@/lib/services/statsService";

// Map backend names to frontend interface
interface Thread {
    id: string;
    title: string;
    author: string;
    avatar: string;
    category: string;
    upvotes: number;
    comments: number;
    time: string;
    excerpt: string;
    tags: string[];
    trending?: boolean;
}

const categories = ["All", "Code", "Optimization", "Tutorial", "Discussion", "Showcase", "Meta"];

function ThreadCard({ thread, index }: { thread: Thread; index: number }) {
    const [upvoted, setUpvoted] = useState(false);
    const [votes, setVotes] = useState(thread.upvotes);

    const handleUpvote = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!upvoted) { setVotes(v => v + 1); setUpvoted(true); }
        else { setVotes(v => v - 1); setUpvoted(false); }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.07 }}
            className="border border-border/50 rounded-xl bg-card hover:border-accent/30 transition-all p-5 group cursor-pointer"
        >
            <div className="flex items-start gap-4">
                {/* Vote column */}
                <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                    <button
                        onClick={handleUpvote}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${upvoted ? "bg-accent/20 text-accent" : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <ThumbsUp className="w-4 h-4" />
                    </button>
                    <span className={`text-sm font-bold ${upvoted ? "text-accent" : "text-muted-foreground"}`}>{votes}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium">{thread.category}</span>
                        {thread.trending && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1">
                                <Flame className="w-3 h-3" /> Trending
                            </span>
                        )}
                    </div>
                    <h3 className="font-semibold text-base text-foreground group-hover:text-accent transition-colors mb-2 leading-snug">
                        {thread.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{thread.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">{thread.avatar}</div>
                            <span>{thread.author}</span>
                        </div>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{thread.time}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{thread.comments} comments</span>
                        <div className="flex gap-1 flex-wrap">
                            {thread.tags.map(tag => (
                                <span key={tag} className="flex items-center gap-0.5 text-muted-foreground/70">
                                    <Hash className="w-2.5 h-2.5" />{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function CommunityPage() {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [sortBy, setSortBy] = useState("trending");
    const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                setIsLoading(true);
                const data = await discussionService.getAllDiscussions();
                const mapped: Thread[] = data.map(d => ({
                    id: d.id,
                    title: d.title,
                    author: d.user.username,
                    avatar: d.user.username[0].toUpperCase(),
                    category: d.category,
                    upvotes: d.upvotes,
                    comments: d.comments,
                    time: formatDistanceToNow(new Date(d.createdAt), { addSuffix: true }),
                    excerpt: d.excerpt,
                    tags: d.tags,
                    trending: d.trending
                }));
                setThreads(mapped);
            } catch (error) {
                console.error("Failed to fetch discussions:", error);
                toast.error("Failed to load community discussions");
            } finally {
                setIsLoading(false);
            }
        };

        const fetchStats = async () => {
            try {
                const stats = await statsService.getCommunityStats();
                setCommunityStats(stats);
            } catch (error) {
                console.error("Failed to fetch community stats:", error);
            }
        };

        fetchThreads();
        fetchStats();
    }, []);

    const filtered = activeCategory === "All" ? threads : threads.filter(t => t.category === activeCategory);
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "trending") return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.upvotes - a.upvotes;
        if (sortBy === "votes") return b.upvotes - a.upvotes;
        return b.comments - a.comments;
    });

    const handleStartDiscussion = () => {
        if (!user) {
            toast.error("You must be logged in to start a discussion");
            return;
        }
        // Since we don't have a full modal in this task, we'll just show a placeholder
        toast.info("Discussion creation feature coming soon!");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="border-b border-border/50 bg-gradient-to-b from-card/50 to-background py-14">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground">Community</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight font-display mb-3">
                                Community
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-xl">
                                Join thousands of AI engineers sharing insights, prompt strategies, and feedback.
                            </p>
                        </div>
                        <button 
                            onClick={handleStartDiscussion}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            Start Discussion
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-8 max-w-sm">
                        {[
                            { label: "Members", value: communityStats?.members ?? "..." },
                            { label: "Discussions", value: communityStats?.discussions ?? "..." },
                            { label: "Prompts Forked", value: communityStats?.reviews ?? "..." },
                        ].map(s => (
                            <div key={s.label} className="text-left">
                                <p className="text-2xl font-black text-foreground">{
                                    typeof s.value === 'number' 
                                        ? s.value > 1000 
                                            ? `${(s.value / 1000).toFixed(1)}K` 
                                            : s.value 
                                        : s.value
                                }</p>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main feed */}
                    <div className="flex-1 min-w-0">
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <div className="flex gap-2 flex-wrap">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${activeCategory === cat
                                                ? "bg-accent text-accent-foreground border-accent"
                                                : "border-border/50 text-muted-foreground hover:text-foreground hover:border-accent/40 bg-transparent"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                <span className="text-xs text-muted-foreground">Sort:</span>
                                {["trending", "votes", "comments"].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSortBy(s)}
                                        className={`text-xs px-2.5 py-1 rounded-lg capitalize transition-colors ${sortBy === s ? "text-accent bg-accent/10" : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Thread list */}
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-card/30 rounded-2xl border border-dashed border-border/50">
                                <Loader2 className="w-8 h-8 animate-spin text-accent mb-4" />
                                <p className="text-muted-foreground animate-pulse">Fetching latest discussions...</p>
                            </div>
                        ) : sorted.length > 0 ? (
                            <div className="space-y-3">
                                {sorted.map((thread, i) => (
                                    <ThreadCard key={thread.id} thread={thread} index={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-card/30 rounded-2xl border border-dashed border-border/50">
                                <MessageSquare className="w-10 h-10 text-muted-foreground/30 mb-4" />
                                <h3 className="text-lg font-semibold mb-1">No discussions yet</h3>
                                <p className="text-muted-foreground text-sm max-w-xs text-center">Be the first to start a conversation with the community!</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-72 shrink-0 space-y-6">
                        {/* Trending topics */}
                        <div className="border border-border/50 rounded-xl bg-card p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-4 h-4 text-accent" />
                                <h3 className="font-semibold text-sm">Trending Topics</h3>
                            </div>
                            <div className="space-y-2">
                                {communityStats ? (
                                    communityStats.trending.map((t, i) => (
                                        <div key={t.tag} className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground hover:text-accent cursor-pointer transition-colors">{t.tag}</span>
                                            <span className="text-xs text-muted-foreground/60">{t.count} posts</span>
                                        </div>
                                    ))
                                ) : (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="h-4 w-full bg-muted/40 animate-pulse rounded mb-2" />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Community guidelines */}
                        <div className="border border-border/50 rounded-xl bg-card p-5">
                            <h3 className="font-semibold text-sm mb-3">Community Guidelines</h3>
                            <ul className="space-y-2 text-xs text-muted-foreground">
                                {[
                                    "Be respectful and constructive",
                                    "Share working prompt examples",
                                    "Give credit when forking others' work",
                                    "Use tags to help categorize posts",
                                    "Report spam or misuse",
                                ].map(g => (
                                    <li key={g} className="flex items-start gap-2">
                                        <ChevronRight className="w-3 h-3 text-accent mt-0.5 shrink-0" />
                                        {g}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
