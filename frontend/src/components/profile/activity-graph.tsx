"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ActivityDay } from "@/lib/services/userService"

interface ActivityGraphProps {
    days: ActivityDay[];
    totalContributions: number;
}

export function ActivityGraph({ days, totalContributions }: ActivityGraphProps) {
    const getColorClass = (count: number) => {
        if (count >= 4) return "bg-green-500 hover:bg-green-400";
        if (count >= 2) return "bg-green-500/60 hover:bg-green-400/80";
        if (count >= 1) return "bg-green-500/30 hover:bg-green-400/50";
        return "bg-muted/40 hover:bg-muted/60";
    }

    return (
        <Card className="w-full bg-card/40 backdrop-blur-xl border-border/50 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/10 transition-colors duration-500" />
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    Prompt Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-end mb-4 text-sm text-muted-foreground">
                    <span>{totalContributions} contributions in the last year</span>
                </div>
                <div className="grid grid-cols-[repeat(52,minmax(0,1fr))] gap-1 overflow-x-auto pb-2 -mx-2 px-2 md:mx-0 md:px-0 scrollbar-thin">
                    {days.map((entry, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-sm transition cursor-pointer ${getColorClass(entry.count)}`}
                            title={`${entry.count === 0 ? 'No' : entry.count} prompts on ${entry.day}`}
                        />
                    ))}
                </div>
                <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-muted/40" />
                        <div className="w-3 h-3 rounded-sm bg-green-500/30" />
                        <div className="w-3 h-3 rounded-sm bg-green-500/60" />
                        <div className="w-3 h-3 rounded-sm bg-green-500" />
                    </div>
                    <span>More</span>
                </div>
            </CardContent>
        </Card>
    )
}
