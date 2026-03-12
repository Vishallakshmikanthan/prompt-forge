import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, GitFork, ArrowBigUp, Star } from "lucide-react";
import { Magnetic } from "@/lib/animations/magnetic";
import { PromptPreview } from "./prompt-preview";
import { PromptMeta } from "./prompt-meta";
import { type Prompt, promptService } from "@/lib/services/promptService";
import { bookmarkService } from "@/lib/services/bookmarkService";
import { useAuth } from "@/components/auth/auth-provider";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner"; // Assuming sonner is used based on common shadcn setups

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
        // Optimistic update
        setScore(prev => prev + 1);
        setHasVoted(true);

        try {
            await promptService.votePrompt(initialPrompt.id, user.id);
            toast.success("Vote recorded!");
        } catch (error: any) {
            // Revert optimistic update
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

        // Optimistic update
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
            // Revert optimistic update
            setIsBookmarked(previousState);
            toast.error(error.message || "Failed to update bookmark");
        } finally {
            setIsBookmarking(false);
        }
    };

    return (
        <Card className="flex flex-col h-full bg-card/80 backdrop-blur-sm border-border/50 hover:border-accent/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(99,102,241,0.15)] group relative overflow-hidden will-change-transform">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <Link href={`/prompt/${initialPrompt.id}`} className="flex-grow flex flex-col relative z-10">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <CardTitle className="text-xl line-clamp-1 group-hover:text-accent transition-colors duration-300">
                                {initialPrompt.title}
                            </CardTitle>
                            <CardDescription className="mt-2 text-sm line-clamp-2">
                                {initialPrompt.description}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col gap-4 pb-2">
                    <PromptMeta
                        category={initialPrompt.category}
                        aiModel={initialPrompt.aiModel}
                        tags={initialPrompt.tags}
                    />

                    <div className="mt-auto z-10">
                        {/* We use stopPropagation inside PromptPreview if they click the button */}
                        <PromptPreview text={initialPrompt.promptContent} />
                    </div>
                </CardContent>
            </Link>

            <CardFooter className="pt-4 border-t border-border/50 flex justify-between items-center text-sm text-muted-foreground bg-muted/5 group-hover:bg-accent/5 rounded-b-xl px-4 transition-colors duration-500 relative z-10">
                <div className="flex items-center gap-4">
                    <Magnetic pullStrength={0.2} elasticReturn={true}>
                        <div className="flex items-center gap-2 group/author hover:text-accent transition-colors cursor-pointer">
                            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                                {initialPrompt.author?.username ? initialPrompt.author.username.charAt(0).toUpperCase() : "?"}
                            </div>
                            <span className="font-medium text-foreground group-hover/author:text-accent transition-colors">{initialPrompt.author?.username || "Unknown"}</span>
                        </div>
                    </Magnetic>
                </div>

                <div className="flex items-center gap-1">
                    <div className="flex items-center gap-3 mr-3">
                        <Magnetic pullStrength={0.3}>
                            <motion.div
                                onClick={handleVote}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${hasVoted ? 'text-accent' : 'hover:text-accent'}`}
                            >
                                <motion.div
                                    animate={hasVoted ? { scale: [1, 1.4, 1] } : {}}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ArrowBigUp className={`w-5 h-5 ${hasVoted ? 'fill-accent' : ''}`} />
                                </motion.div>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={score}
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="font-medium min-w-[1rem] text-center"
                                    >
                                        {score}
                                    </motion.span>
                                </AnimatePresence>
                            </motion.div>
                        </Magnetic>
                        <Magnetic pullStrength={0.3}>
                            <div className="flex items-center gap-1.5 hover:text-accent transition-colors cursor-pointer">
                                <GitFork className="w-4 h-4" />
                                <span className="font-medium">{(initialPrompt as any)._count?.forkedPrompts || 0}</span>
                            </div>
                        </Magnetic>
                    </div>

                    <Magnetic pullStrength={0.4}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 transition-colors ${isBookmarked ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10' : 'text-muted-foreground hover:text-accent hover:bg-accent/10'}`}
                            onClick={handleBookmark}
                            disabled={isBookmarking}
                        >
                            <motion.div
                                initial={false}
                                animate={isBookmarked ? { scale: [1, 1.3, 1], rotate: [0, 15, 0] } : { scale: 1 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                <Star className={`w-4 h-4 ${isBookmarked ? 'fill-yellow-500' : ''}`} />
                            </motion.div>
                            <span className="sr-only">Bookmark</span>
                        </Button>
                    </Magnetic>
                </div>
            </CardFooter>
        </Card>
    );
}
