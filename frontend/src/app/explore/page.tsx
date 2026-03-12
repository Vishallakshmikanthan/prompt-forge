"use client";

import { TrendingSection } from "@/components/discovery/trending-section";
import { TopSection } from "@/components/discovery/top-section";
import { NewSection } from "@/components/discovery/new-section";
import { PersonalizedSection } from "@/components/discovery/personalized-section";
import { createClient } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { type User } from "@supabase/supabase-js";
import { RadiantPromptInput } from "@/components/ui/radiant-prompt-input";

export default function ExplorePage() {
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();
    }, []);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-grow py-12">
                <div className="container mx-auto px-4">
                    <div className="space-y-12 md:space-y-20">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground/80 to-accent bg-clip-text text-transparent">
                                Discover Excellence
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl">
                                Browse through our curated feeds of the most powerful and effective AI prompts across all categories.
                            </p>
                        </div>

                        <div className="flex justify-center w-full">
                            <RadiantPromptInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                onSubmit={(val) => console.log("Searching for:", val)}
                            />
                        </div>

                        {user && (
                            <>
                                <PersonalizedSection userId={user.id} />
                                <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                            </>
                        )}

                        <TrendingSection />

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />

                        <TopSection />

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />

                        <NewSection />
                    </div>
                </div>
            </main>
        </div>
    );
}
