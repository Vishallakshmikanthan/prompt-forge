import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, GitFork, ArrowBigUp, Star, Eye, Play, Calendar } from "lucide-react";
import { Magnetic } from "@/lib/animations/magnetic";
import { PromptPreview } from "./prompt-preview";
import { PromptMeta } from "./prompt-meta";
import { type Prompt, promptService } from "@/lib/services/promptService";
import { bookmarkService } from "@/lib/services/bookmarkService";
import { useAuth } from "@/components/auth/auth-provider";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface PromptCardProps {
    prompt: Prompt;
}

export function PromptCard({ prompt: initialPrompt }: PromptCardProps) {
    const { user } = useAuth();
    const [score, setScore] = useState(initialPrompt.score);
    const [hasVoted, setHasVoted] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isBookmarking, setIsBookmarking] = useState(false);

    // Get analytics data safely
    const analytics = (initialPrompt as any).analytics || {};
    const views = analytics.views || 0;
    const forks = (initialPrompt as any)._count?.forkedPrompts || analytics.forks || 0;
    const likes = initialPrompt.score || analytics.votes || 0;

    const handleVote = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("Please login to vote");
            return;
        }

        if (hasVoted) {
            toast.info("You already voted for this prompt");
            return;
        }

        setIsVoting(true);
        setScore(prev => prev + 1);
        setHasVoted(true);

        try {
            await promptService.votePrompt(initialPrompt.id, user.id);
            toast.success("Vote recorded!");
        } catch (error: any) {
            setScore(prev => prev - 1);
            setHasVoted(false);
            toast.error(error.message || "Failed to vote");
        } finally {
            setIsVoting(false);
        }
    };

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("Please login to bookmark");
            return;
        }

        setIsBookmarking(true);
        const previousState = isBookmarked;
        setIsBookmarked(!previousState);

        try {
            if (previousState) {
                await bookmarkService.removeBookmark(initialPrompt.id, user.id);
                toast.success("Bookmark removed");
            } else {
                await bookmarkService.addBookmark(initialPrompt.id, user.id);
                toast.success("Prompt bookmarked!");
            }
        } catch (error: any) {
            setIsBookmarked(previousState);
            toast.error(error.message || "Failed to update bookmark");
        } finally {
            setIsBookmarking(false);
        }
    };

    const handleRun = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toast.success("Opening prompt in playground...");
        // Logic to navigate to playground with this prompt
    };

    const handleFork = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toast.success("Forking prompt...");
        // Logic to fork the prompt
    };

    return (
        <Card className="flex flex-col h-full bg-card/80 backdrop-blur-md border-border/50 hover:border-accent/50 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden will-change-transform shadow-lg hover:shadow-accent/10">
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute -inset-[2px] bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md pointer-events-none z-0" />

            <Link href={`/prompt/${initialPrompt.id}`} className="flex-grow flex flex-col relative z-10">
                <CardHeader className="pb-3 border-b border-border/30 bg-muted/5">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <CardTitle className="text-xl line-clamp-1 group-hover:text-accent transition-colors duration-300 font-bold">
                                {initialPrompt.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground font-medium">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDistanceToNow(new Date(initialPrompt.createdAt))} ago</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col gap-4 py-5">
                    <CardDescription className="text-sm line-clamp-2 leading-relaxed">
                        {initialPrompt.description}
                    </CardDescription>

                    <PromptMeta
                        category={initialPrompt.category}
                        aiModel={initialPrompt.aiModel}
                        tags={initialPrompt.tags}
                    />

                    <div className="mt-auto space-y-4">
                        <PromptPreview text={initialPrompt.promptContent} />
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/50">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5" /> {views}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5" /> {score}
                                </span>
                                <span className="flex items-center gap-1">
                                    <GitFork className="w-3.5 h-3.5" /> {forks}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Link>

            <CardFooter className="pt-4 border-t border-border/50 flex justify-between items-center bg-muted/10 group-hover:bg-accent/5 rounded-b-xl px-4 py-3 transition-colors duration-500 relative z-10">
                <div className="flex items-center gap-3">
                    <Magnetic pullStrength={0.2}>
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-all cursor-pointer">
                            <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-white">
                                {initialPrompt.author?.username ? initialPrompt.author.username.charAt(0).toUpperCase() : "?"}
                            </div>
                            <span className="text-xs font-semibold text-foreground/80">{initialPrompt.author?.username || "Unknown"}</span>
                        </div>
                    </Magnetic>
                </div>

                <div className="flex items-center gap-1.5">
                    <Magnetic pullStrength={0.3}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-primary/20 hover:text-primary transition-all text-muted-foreground"
                            onClick={handleRun}
                            title="Run Prompt"
                        >
                            <Play className="w-4 h-4 fill-current" />
                        </Button>
                    </Magnetic>

                    <Magnetic pullStrength={0.3}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-orange-500/20 hover:text-orange-500 transition-all text-muted-foreground"
                            onClick={handleFork}
                            title="Fork Prompt"
                        >
                            <GitFork className="w-4 h-4" />
                        </Button>
                    </Magnetic>

                    <Magnetic pullStrength={0.3}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-8 w-8 rounded-full transition-all",
                                isBookmarked ? "text-yellow-500 bg-yellow-500/10" : "text-muted-foreground hover:bg-yellow-500/10 hover:text-yellow-500"
                            )}
                            onClick={handleBookmark}
                            disabled={isBookmarking}
                            title="Bookmark"
                        >
                            <Star className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                        </Button>
                    </Magnetic>
                </div>
            </CardFooter>
        </Card>
    );
}
