"use client"

import React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, GitFork, Play, Sparkles, Eye } from "lucide-react"
import type { FeaturedPromptData } from "@/lib/services/userService"
import Link from "next/link"

interface FeaturedPromptProps {
    prompt: FeaturedPromptData | null;
}

export function FeaturedPrompt({ prompt }: FeaturedPromptProps) {
    if (!prompt) {
        return null;
    }

    return (
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <Card className="relative bg-card/80 backdrop-blur-xl border-border/50 shadow-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 p-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 flex gap-1 items-center px-3 py-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Featured
                    </Badge>
                </div>

                <CardHeader className="pb-2 pt-6">
                    <div className="flex flex-wrap gap-2 mb-3 mt-4">
                        <Badge variant="outline" className="text-xs">{prompt.category}</Badge>
                        {prompt.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {prompt.title}
                    </h3>
                </CardHeader>

                <CardContent>
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                        {prompt.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5 text-yellow-500">
                            <Star className="w-4 h-4 fill-yellow-500" />
                            <span>{prompt.score} ({prompt.likes.toLocaleString()})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <GitFork className="w-4 h-4" />
                            <span>{prompt.forks.toLocaleString()} forks</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Eye className="w-4 h-4" />
                            <span>{prompt.views.toLocaleString()} views</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-2 pb-6">
                    <Link href={`/prompt/${prompt.id}`}>
                        <Button className="w-full sm:w-auto font-semibold shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                            Try Prompt
                            <Play className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
