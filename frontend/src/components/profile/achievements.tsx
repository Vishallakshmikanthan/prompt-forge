"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Flame, Lightbulb, CalendarDays, Heart, Sparkles } from "lucide-react"

const achievementsList = [
    {
        title: "Top Prompt Engineer",
        description: "Reached top 1% of creators globally",
        icon: <Award className="w-8 h-8 text-yellow-500" />,
        color: "bg-yellow-500/10 border-yellow-500/30",
    },
    {
        title: "Viral Prompt",
        description: "One prompt reached 10,000+ views",
        icon: <Flame className="w-8 h-8 text-orange-500" />,
        color: "bg-orange-500/10 border-orange-500/30",
    },
    {
        title: "AI Research Contributor",
        description: "High quality system design prompts",
        icon: <Lightbulb className="w-8 h-8 text-blue-500" />,
        color: "bg-blue-500/10 border-blue-500/30",
    },
    {
        title: "30 Day Streak",
        description: "Created prompts 30 days in a row",
        icon: <CalendarDays className="w-8 h-8 text-green-500" />,
        color: "bg-green-500/10 border-green-500/30",
    },
    {
        title: "Community Favorite",
        description: "Received over 1,000 total likes",
        icon: <Heart className="w-8 h-8 text-pink-500" />,
        color: "bg-pink-500/10 border-pink-500/30",
    },
]

export function Achievements() {
    return (
        <Card className="w-full bg-card/40 backdrop-blur-xl border-border/50 shadow-sm relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Achievements & Badges
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {achievementsList.map((achievement, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col items-center justify-center text-center p-4 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/5 cursor-pointer ${achievement.color}`}
                            title={achievement.description}
                        >
                            <div className="mb-3 p-3 bg-background/50 rounded-full shadow-inner">
                                {achievement.icon}
                            </div>
                            <h4 className="font-semibold text-sm leading-tight mb-1">{achievement.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">{achievement.description}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
