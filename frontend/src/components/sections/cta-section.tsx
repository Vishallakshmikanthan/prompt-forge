"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";

export function CtaSection() {
    const { user } = useAuth();

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background styling */}
            <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-primary/10 to-transparent blur-3xl rounded-full opacity-50"></div>

            <div className="container relative z-10 mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                    Start Exploring Developer Prompts
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                    Join thousands of developers using PromptForge to manage, version, and share their best prompts.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/categories">
                        <Button size="lg" className="h-14 px-8 text-lg font-semibold rounded-full group">
                            Browse Categories
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href={user ? "/upload" : "/login"}>
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold rounded-full bg-background hover:bg-muted transition-colors">
                            Upload Prompt
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
