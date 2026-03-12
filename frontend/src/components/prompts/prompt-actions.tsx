"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, GitFork, Star, Check } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { bookmarkService } from "@/lib/services/bookmarkService";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";

interface PromptActionsProps {
    promptId: string;
    promptText: string;
    title?: string;
    description?: string;
    category?: string;
    aiModel?: string;
    tags?: string[];
}

export function PromptActions({ promptId, promptText, title, description, category, aiModel, tags }: PromptActionsProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isBookmarking, setIsBookmarking] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(promptText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success("Prompt copied to clipboard");
        } catch (err) {
            console.error("Failed to copy text: ", err);
            toast.error("Failed to copy text");
        }
    };

    const handleFork = () => {
        if (!user) {
            toast.error("Please login to fork this prompt");
            return;
        }

        // Store fork data in sessionStorage to prefill the upload page
        const forkData = {
            parentPromptId: promptId,
            title: title || "",
            description: description || "",
            promptContent: promptText,
            category: category || "",
            aiModel: aiModel || "",
            tags: tags || [],
        };

        sessionStorage.setItem("promptforge_fork_data", JSON.stringify(forkData));
        toast.success("Forking prompt... Redirecting to editor");

        // redirect to upload page
        router.push("/upload?fork=true");
    };

    const handleBookmark = async () => {
        if (!user) {
            toast.error("Please login to bookmark");
            return;
        }

        setIsBookmarking(true);
        const previousState = isBookmarked;
        setIsBookmarked(!previousState);

        try {
            if (previousState) {
                await bookmarkService.removeBookmark(promptId, user.id);
                toast.success("Bookmark removed");
            } else {
                await bookmarkService.addBookmark(promptId, user.id);
                toast.success("Prompt bookmarked!");
            }
        } catch (error: any) {
            setIsBookmarked(previousState);
            toast.error(error.message || "Failed to update bookmark");
        } finally {
            setIsBookmarking(false);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Button
                size="lg"
                onClick={handleCopy}
                className={`flex-1 sm:flex-none transition-all duration-300 min-w-[120px] ${copied ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
            >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy Content"}
            </Button>

            <Button
                variant="outline"
                size="lg"
                onClick={handleFork}
                className="flex-1 sm:flex-none"
            >
                <GitFork className="w-4 h-4 mr-2" />
                Fork Variant
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                disabled={isBookmarking}
                className={`w-11 h-11 transition-all duration-300 ${isBookmarked ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                title={isBookmarked ? "Remove bookmark" : "Bookmark prompt"}
            >
                <motion.div
                    whileTap={{ scale: 0.8 }}
                    animate={isBookmarked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                >
                    <Star className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
                </motion.div>
                <span className="sr-only">Bookmark</span>
            </Button>
        </div>
    );
}
