"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquareReply, Trash2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { fetchApi, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type CommentAuthor = {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
};

type CommentNode = {
    id: string;
    content: string;
    upvotes: number;
    createdAt: string;
    author: CommentAuthor;
    replies: CommentNode[];
};

interface CommentSectionProps {
    promptId: string;
}

export default function CommentSection({ promptId }: CommentSectionProps) {
    const { user } = useAuth();
    const [comments, setComments] = useState<CommentNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const [activeReplyFor, setActiveReplyFor] = useState<string | null>(null);
    const [newCommentContent, setNewCommentContent] = useState("");
    const [replyContent, setReplyContent] = useState("");

    const authHeaders = useMemo<Record<string, string>>(() => {
        if (!user?.id) return {};
        return { "user-id": user.id };
    }, [user?.id]);

    const loadComments = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await fetchApi<CommentNode[]>(`/prompts/${promptId}/comments`);
            setComments(data);
        } catch (error) {
            console.error("Failed to load comments:", error);
            toast.error("Unable to load comments");
        } finally {
            setIsLoading(false);
        }
    }, [promptId]);

    useEffect(() => {
        void loadComments();
    }, [loadComments]);

    const requireAuth = () => {
        if (!user?.id) {
            toast.error("Please sign in to interact with comments");
            return false;
        }
        return true;
    };

    const handlePostComment = async () => {
        const content = newCommentContent.trim();
        if (!content) return;
        if (!requireAuth()) return;

        try {
            setIsSubmittingComment(true);
            await fetchApi(`/prompts/${promptId}/comments`, {
                method: "POST",
                headers: authHeaders,
                body: JSON.stringify({ content }),
            });
            setNewCommentContent("");
            await loadComments();
        } catch (error) {
            const message = error instanceof ApiError ? error.message : "Failed to post comment";
            toast.error(message);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleReply = async (commentId: string) => {
        const content = replyContent.trim();
        if (!content) return;
        if (!requireAuth()) return;

        try {
            setIsSubmittingReply(true);
            await fetchApi(`/comments/${commentId}/replies`, {
                method: "POST",
                headers: authHeaders,
                body: JSON.stringify({ content }),
            });
            setReplyContent("");
            setActiveReplyFor(null);
            await loadComments();
        } catch (error) {
            const message = error instanceof ApiError ? error.message : "Failed to post reply";
            toast.error(message);
        } finally {
            setIsSubmittingReply(false);
        }
    };

    const handleUpvote = async (commentId: string) => {
        if (!requireAuth()) return;

        try {
            await fetchApi(`/comments/${commentId}/upvote`, {
                method: "POST",
                headers: authHeaders,
            });
            await loadComments();
        } catch (error) {
            const message = error instanceof ApiError ? error.message : "Failed to update upvote";
            toast.error(message);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!requireAuth()) return;

        try {
            await fetchApi(`/comments/${commentId}`, {
                method: "DELETE",
                headers: authHeaders,
            });
            await loadComments();
        } catch (error) {
            const message = error instanceof ApiError ? error.message : "Failed to delete comment";
            toast.error(message);
        }
    };

    const renderComment = (comment: CommentNode, isReply = false) => {
        const displayName = comment.author.displayName || comment.author.username || "Unknown";
        const avatarLabel = (displayName[0] ?? "U").toUpperCase();
        const canDelete = user?.id === comment.author.id;

        return (
            <div
                key={comment.id}
                className={`rounded-xl border bg-card p-4 ${isReply ? "ml-6 border-l-4 border-l-border" : ""}`}
            >
                <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {avatarLabel}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{displayName}</p>
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>

                <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                    <ReactMarkdown>{comment.content}</ReactMarkdown>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => void handleUpvote(comment.id)}>
                        <ThumbsUp className="mr-1.5 h-3.5 w-3.5" />
                        {comment.upvotes}
                    </Button>

                    {!isReply && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                if (activeReplyFor === comment.id) {
                                    setActiveReplyFor(null);
                                    setReplyContent("");
                                    return;
                                }
                                setActiveReplyFor(comment.id);
                                setReplyContent("");
                            }}
                        >
                            <MessageSquareReply className="mr-1.5 h-3.5 w-3.5" />
                            Reply
                        </Button>
                    )}

                    {canDelete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => void handleDelete(comment.id)}
                        >
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                            Delete
                        </Button>
                    )}
                </div>

                {!isReply && activeReplyFor === comment.id && (
                    <div className="mt-4 space-y-3 rounded-lg border bg-muted/20 p-3">
                        <Textarea
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={3}
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                onClick={() => void handleReply(comment.id)}
                                disabled={isSubmittingReply || !replyContent.trim()}
                            >
                                {isSubmittingReply ? "Posting..." : "Post Reply"}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setActiveReplyFor(null);
                                    setReplyContent("");
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3">
                        {comment.replies.map((reply) => renderComment(reply, true))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <section className="mt-10 space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">Comments</h2>
                <p className="text-sm text-muted-foreground">
                    Discuss this prompt, share improvements, and ask clarifying questions.
                </p>
            </div>

            <div className="space-y-3 rounded-xl border bg-card p-4">
                <Textarea
                    placeholder={user ? "Add a comment in markdown..." : "Sign in to post a comment"}
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    rows={4}
                    disabled={!user}
                />
                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">Markdown is supported.</p>
                    <Button
                        onClick={() => void handlePostComment()}
                        disabled={!user || isSubmittingComment || !newCommentContent.trim()}
                    >
                        {isSubmittingComment ? "Posting..." : "Post Comment"}
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-b-transparent" />
                    <p className="text-sm text-muted-foreground">Loading comments...</p>
                </div>
            ) : comments.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                    No comments yet. Be the first to start the discussion.
                </div>
            ) : (
                <div className="space-y-4">{comments.map((comment) => renderComment(comment))}</div>
            )}
        </section>
    );
}
