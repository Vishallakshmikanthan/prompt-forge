"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromptCard } from "@/components/ui/prompt-card";
import { Library, GitFork, Bookmark } from "lucide-react";

interface ProfileTabsProps {
    prompts: any[];
    forks: any[];
    bookmarks: any[];
}

export function ProfileTabs({ prompts, forks, bookmarks }: ProfileTabsProps) {
    const [activeTab, setActiveTab] = useState("prompts");

    return (
        <Tabs defaultValue="prompts" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="prompts" className="flex items-center gap-2">
                    <Library className="h-4 w-4" />
                    <span className="hidden sm:inline">Prompts</span>
                    <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                        {prompts.length}
                    </span>
                </TabsTrigger>
                <TabsTrigger value="forks" className="flex items-center gap-2">
                    <GitFork className="h-4 w-4" />
                    <span className="hidden sm:inline">Forks</span>
                    <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                        {forks.length}
                    </span>
                </TabsTrigger>
                <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    <span className="hidden sm:inline">Bookmarks</span>
                    <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                        {bookmarks.length}
                    </span>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="prompts" className="mt-0">
                {prompts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {prompts.map((prompt) => (
                            <PromptCard
                                key={prompt.id}
                                title={prompt.title}
                                description={prompt.description}
                                category={prompt.category}
                                author={prompt.author?.username || 'Unknown'}
                                stats={{
                                    likes: prompt._count?.votes || 0,
                                    forks: prompt._count?.forkedPrompts || 0,
                                    comments: 0
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl border-dashed">
                        <Library className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Prompts Yet</h3>
                        <p className="text-muted-foreground max-w-sm">
                            This user hasn't created any original prompts.
                        </p>
                    </div>
                )}
            </TabsContent>

            <TabsContent value="forks" className="mt-0">
                {forks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {forks.map((fork) => (
                            <PromptCard
                                key={fork.id}
                                title={fork.title}
                                description={fork.description}
                                category={fork.category}
                                author={fork.author?.username || 'Unknown'}
                                stats={{
                                    likes: fork._count?.votes || 0,
                                    forks: fork._count?.forkedPrompts || 0,
                                    comments: 0
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl border-dashed">
                        <GitFork className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Forks Yet</h3>
                        <p className="text-muted-foreground max-w-sm">
                            This user hasn't derived any prompts from others.
                        </p>
                    </div>
                )}
            </TabsContent>

            <TabsContent value="bookmarks" className="mt-0">
                {bookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {bookmarks.map((bookmark) => (
                            <PromptCard
                                key={bookmark.id}
                                title={bookmark.title}
                                description={bookmark.description}
                                category={bookmark.category}
                                author={bookmark.author?.username || 'Unknown'}
                                stats={{
                                    likes: bookmark._count?.votes || 0,
                                    forks: bookmark._count?.forkedPrompts || 0,
                                    comments: 0
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl border-dashed">
                        <Bookmark className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Bookmarks</h3>
                        <p className="text-muted-foreground max-w-sm">
                            This user hasn't saved any prompts.
                        </p>
                    </div>
                )}
            </TabsContent>
        </Tabs>
    );
}
