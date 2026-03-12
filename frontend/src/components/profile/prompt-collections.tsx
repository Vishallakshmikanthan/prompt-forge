"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderGit2, Code2, Cpu, Wrench, Palette, BookOpen, Braces } from "lucide-react"
import type { CollectionData } from "@/lib/services/userService"

interface PromptCollectionsProps {
    collections: CollectionData[];
}

const iconMap: Record<string, React.ReactNode> = {
    "coding": <Code2 className="w-6 h-6" />,
    "system-design": <Cpu className="w-6 h-6" />,
    "engineering": <Wrench className="w-6 h-6" />,
    "creative": <Palette className="w-6 h-6" />,
    "writing": <BookOpen className="w-6 h-6" />,
    "default": <Braces className="w-6 h-6" />,
}

const colorMap: string[] = [
    "from-blue-500/20 to-cyan-500/20 text-blue-500",
    "from-purple-500/20 to-pink-500/20 text-purple-500",
    "from-orange-500/20 to-red-500/20 text-orange-500",
    "from-green-500/20 to-teal-500/20 text-green-500",
    "from-rose-500/20 to-amber-500/20 text-rose-500",
]

export function PromptCollections({ collections }: PromptCollectionsProps) {
    if (!collections || collections.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <FolderGit2 className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold tracking-tight">Prompt Collections</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {collections.map((collection, idx) => {
                    const color = colorMap[idx % colorMap.length];
                    const icon = iconMap[collection.title.toLowerCase()] || iconMap["default"];

                    return (
                        <Card
                            key={idx}
                            className="group relative overflow-hidden bg-card/40 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 cursor-pointer"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <CardHeader className="pb-2 relative z-10">
                                <div className="mb-2 p-2 w-fit rounded-lg bg-background/80 shadow-sm border">
                                    {icon}
                                </div>
                                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                    {collection.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground/80 transition-colors">
                                    {collection.count} prompts
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    )
}
