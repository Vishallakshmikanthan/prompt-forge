"use client";

import { useEffect, useState } from "react";
import { userService, type LeaderboardUser } from "@/lib/services/userService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Star, Shield, Award, ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LeaderboardPage() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setIsLoading(true);
                const data = await userService.getLeaderboard(20);
                setUsers(data);
            } catch (err: any) {
                console.error("Failed to fetch leaderboard:", err);
                setError("Unable to load leaderboard data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getBadgeInfo = (reputation: number) => {
        if (reputation >= 1000) return { label: "Master", icon: Trophy, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
        if (reputation >= 500) return { label: "Expert", icon: Shield, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" };
        if (reputation >= 100) return { label: "Contributor", icon: Award, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
        return { label: "Beginner", icon: Star, color: "bg-slate-500/10 text-slate-500 border-slate-500/20" };
    };

    if (isLoading) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center pt-24 pb-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground text-lg">Ranking the top contributors...</p>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col pt-24 pb-20 bg-muted/5">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header Section */}
                <div className="flex flex-col gap-6 mb-12">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="w-fit -ml-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Explore
                        </Button>
                    </Link>
                    <div className="text-center md:text-left space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-2">
                            🏆 LEADERBOARD
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Top Contributors</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            Recognizing the creators who shape the future of AI engineering.
                            Earn reputation by sharing high-quality prompts.
                        </p>
                    </div>
                </div>

                {error ? (
                    <div className="bg-destructive/10 text-destructive p-8 rounded-xl text-center">
                        <p>{error}</p>
                    </div>
                ) : users.length > 0 ? (
                    <div className="grid gap-6">
                        {/* Top 3 Podiums (Visual highlight for top earners) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {users.slice(0, 3).map((user, index) => {
                                const badge = getBadgeInfo(user.reputation);
                                const rankColors = [
                                    "border-amber-500/50 bg-amber-500/5 shadow-amber-500/10",
                                    "border-slate-400/50 bg-slate-400/5 shadow-slate-400/10",
                                    "border-orange-600/50 bg-orange-600/5 shadow-orange-600/10"
                                ];
                                const icons = [Trophy, Medal, Medal];
                                const Icon = icons[index];

                                return (
                                    <Link key={user.id} href={`/user/${user.username}`}>
                                        <div className={`relative p-8 rounded-2xl border-2 transition-all hover:scale-[1.02] ${rankColors[index]}`}>
                                            <div className="absolute top-4 right-4">
                                                <Icon className={`h-8 w-8 ${index === 0 ? "text-amber-500" : index === 1 ? "text-slate-400" : "text-orange-600"}`} />
                                            </div>
                                            <div className="flex flex-col items-center text-center gap-4">
                                                <div className="relative">
                                                    <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
                                                        <AvatarImage src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
                                                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-background">
                                                        #{index + 1}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-bold">{user.username}</h3>
                                                    <Badge variant="outline" className={`${badge.color} border-none font-bold uppercase tracking-wider text-[10px]`}>
                                                        {badge.label}
                                                    </Badge>
                                                </div>
                                                <div className="text-3xl font-black text-primary">
                                                    {user.reputation}
                                                    <span className="text-[10px] font-bold block opacity-60 uppercase tracking-tighter">REP POINTS</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Remaining List */}
                        <div className="bg-card rounded-xl border border-border/50 divide-y overflow-hidden shadow-sm">
                            {users.slice(3).map((user, index) => {
                                const badge = getBadgeInfo(user.reputation);
                                return (
                                    <Link key={user.id} href={`/user/${user.username}`}>
                                        <div className="flex items-center justify-between p-4 md:px-8 hover:bg-muted/50 transition-colors group">
                                            <div className="flex items-center gap-6">
                                                <span className="text-muted-foreground font-mono font-bold w-6 text-center group-hover:text-primary transition-colors">
                                                    #{index + 4}
                                                </span>
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-10 w-10 border border-border/50">
                                                        <AvatarImage src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
                                                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-bold">{user.username}</h4>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <Badge variant="outline" className={`py-0 px-1.5 text-[9px] rounded-sm font-medium border-none ${badge.color}`}>
                                                                {badge.label}
                                                            </Badge>
                                                            <span className="text-[10px] text-muted-foreground">• {user._count.prompts} prompts published</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold tabular-nums">{user.reputation}</div>
                                                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">POINTS</div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="bg-muted/20 border-2 border-dashed p-12 rounded-xl text-center">
                        <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                        <h2 className="text-xl font-bold mb-2">No contributors found yet</h2>
                        <p className="text-muted-foreground">The ranking table is currently empty. Be the first to earn reputation!</p>
                    </div>
                )}
            </div>
        </main>
    );
}
