"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitFork, Heart, MessageSquare, PlusCircle, Activity } from "lucide-react"
import type { TimelineEvent } from "@/lib/services/userService"

interface ActivityTimelineProps {
    events: TimelineEvent[];
}

const iconMap: Record<string, React.ReactNode> = {
    create: <PlusCircle className="w-4 h-4 text-green-500" />,
    fork: <GitFork className="w-4 h-4 text-purple-500" />,
    like: <Heart className="w-4 h-4 text-pink-500" />,
    comment: <MessageSquare className="w-4 h-4 text-blue-500" />,
}

function formatRelativeTime(timestamp: string): string {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
    if (!events || events.length === 0) {
        return (
            <Card className="w-full bg-card/40 backdrop-blur-xl border-border/50 shadow-sm p-8 text-center text-muted-foreground">
                No activity yet.
            </Card>
        );
    }

    return (
        <Card className="w-full bg-card/40 backdrop-blur-xl border-border/50 shadow-sm relative overflow-hidden">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Developer Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {events.map((event, idx) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                            <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform hover:scale-110">
                                {iconMap[event.type] || <PlusCircle className="w-4 h-4 text-muted-foreground" />}
                            </div>

                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-background/50 backdrop-blur-sm p-4 rounded-xl border border-border/50 shadow-sm transition-all hover:shadow-md hover:bg-card/80">
                                <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center">
                                    <span className="font-semibold text-sm text-foreground">{event.content}</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">{formatRelativeTime(event.timestamp)}</div>
                            </div>

                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
