"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromptCard } from "@/components/ui/prompt-card";
import { useAuth } from "@/components/auth/auth-provider";
import { userService, type UserProfile, type UserPrompt } from "@/lib/services/userService";
import {
    ArrowLeft,
    Github,
    Globe,
    Twitter,
    Users,
    UserPlus,
    UserCheck,
    Library,
    GitFork,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function PublicUserProfilePage() {
    const params = useParams<{ username: string }>();
    const username = params?.username ?? "";
    const { user: currentUser } = useAuth();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [prompts, setPrompts] = useState<UserPrompt[]>([]);
    const [forks, setForks] = useState<UserPrompt[]>([]);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const isOwnProfile = !!currentUser && profile?.id === currentUser.id;

    useEffect(() => {
        if (!username) return;

        (async () => {
            setLoading(true);
            try {
                const [profileData, promptsData, forksData] = await Promise.all([
                    userService.getUserProfile(username),
                    userService.getUserPrompts(username).catch(() => []),
                    userService.getUserForks(username).catch(() => []),
                ]);
                setProfile(profileData);
                setPrompts(promptsData);
                setForks(forksData);

                // Fetch follow status
                const status = await userService
                    .getFollowStatus(profileData.id, currentUser?.id)
                    .catch(() => ({ following: false, followerCount: 0, followingCount: 0 }));
                setIsFollowing(status.following);
                setFollowerCount(status.followerCount);
                setFollowingCount(status.followingCount);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, [username, currentUser?.id]);

    const handleFollow = async () => {
        if (!currentUser) {
            toast.error("Sign in to follow users");
            return;
        }
        if (!profile) return;
        setFollowLoading(true);
        try {
            const result = await userService.toggleFollow(profile.id, currentUser.id);
            setIsFollowing(result.following);
            setFollowerCount(result.followerCount);
            toast.success(result.following ? `Following ${profile.username}` : `Unfollowed ${profile.username}`);
        } catch {
            toast.error("Failed to update follow status");
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) return <ProfileSkeleton />;

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-2">Profile not found</h1>
                <p className="text-muted-foreground mb-6">
                    No user with the username &quot;{username}&quot; exists.
                </p>
                <Link href="/explore">
                    <Button className="rounded-full px-6">Explore Prompts</Button>
                </Link>
            </div>
        );
    }

    const displayName = profile.username;
    const avatarLetter = displayName.charAt(0).toUpperCase();

    return (
        <div className="container py-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Back */}
            <Link href="/explore">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Explore
                </Button>
            </Link>

            {/* Profile header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Avatar className="h-24 w-24 text-3xl border-4 border-border shadow-lg">
                    <AvatarImage src={profile.avatarUrl ?? undefined} alt={displayName} />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-3xl">
                        {avatarLetter}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-bold">{displayName}</h1>
                        {!isOwnProfile && (
                            <Button
                                onClick={handleFollow}
                                disabled={followLoading}
                                variant={isFollowing ? "outline" : "default"}
                                size="sm"
                                className="rounded-full gap-2"
                            >
                                {isFollowing ? (
                                    <><UserCheck className="h-4 w-4" /> Following</>
                                ) : (
                                    <><UserPlus className="h-4 w-4" /> Follow</>
                                )}
                            </Button>
                        )}
                        {isOwnProfile && (
                            <Link href="/settings/profile">
                                <Button variant="outline" size="sm" className="rounded-full">
                                    Edit Profile
                                </Button>
                            </Link>
                        )}
                    </div>

                    {profile.bio && (
                        <p className="text-muted-foreground max-w-xl">{profile.bio}</p>
                    )}

                    {/* Social links */}
                    <div className="flex flex-wrap gap-3 pt-1">
                        {profile.githubUrl && (
                            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-accent transition-colors">
                                    <Github className="h-3 w-3" />
                                    GitHub
                                </Badge>
                            </a>
                        )}
                        {profile.twitterUrl && (
                            <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer">
                                <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-accent transition-colors">
                                    <Twitter className="h-3 w-3" />
                                    Twitter
                                </Badge>
                            </a>
                        )}
                        {profile.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer">
                                <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-accent transition-colors">
                                    <Globe className="h-3 w-3" />
                                    Website
                                </Badge>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Prompts", value: profile.stats?.promptsCreated ?? profile._count?.prompts ?? 0 },
                    { label: "Forks", value: profile.stats?.forksCreated ?? 0 },
                    { label: "Followers", value: followerCount },
                    { label: "Following", value: followingCount },
                ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl border bg-card p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                            {label === "Followers" || label === "Following" ? (
                                <Users className="h-3 w-3" />
                            ) : null}
                            {label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="prompts">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="prompts" className="gap-2">
                        <Library className="h-4 w-4" />
                        Prompts
                        <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                            {prompts.length}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="forks" className="gap-2">
                        <GitFork className="h-4 w-4" />
                        Forks
                        <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                            {forks.length}
                        </span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="prompts" className="mt-6">
                    {prompts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {prompts.map((prompt) => (
                                <PromptCard
                                    key={prompt.id}
                                    title={prompt.title}
                                    description={prompt.description}
                                    category={prompt.category}
                                    author={prompt.author?.username ?? username}
                                    stats={{
                                        likes: prompt._count?.votes ?? 0,
                                        forks: prompt._count?.forkedPrompts ?? 0,
                                        comments: 0,
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Library className="h-12 w-12 text-muted-foreground/40 mb-4" />
                            <p className="text-muted-foreground">No prompts yet</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="forks" className="mt-6">
                    {forks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {forks.map((fork) => (
                                <PromptCard
                                    key={fork.id}
                                    title={fork.title}
                                    description={fork.description}
                                    category={fork.category}
                                    author={fork.author?.username ?? username}
                                    stats={{
                                        likes: fork._count?.votes ?? 0,
                                        forks: fork._count?.forkedPrompts ?? 0,
                                        comments: 0,
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <GitFork className="h-12 w-12 text-muted-foreground/40 mb-4" />
                            <p className="text-muted-foreground">No forks yet</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="container py-8 max-w-5xl mx-auto space-y-8">
            <Skeleton className="h-10 w-32" />
            <div className="flex gap-6">
                <Skeleton className="h-24 w-24 rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-80" />
                    <Skeleton className="h-6 w-40" />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
            </div>
        </div>
    );
}
