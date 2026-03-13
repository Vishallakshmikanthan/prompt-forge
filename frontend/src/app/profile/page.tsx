"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ProfileErrorBoundary from "@/components/ui/profile-error-boundary";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { userService } from "@/lib/services/userService";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { Skeleton } from "@/components/ui/skeleton";

function ProfileContent() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [profileData, setProfileData] = useState<any>(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.replace("/login");
            } else {
                setIsFetching(true);
                userService.getOwnProfile(user.id)
                    .then(data => {
                        setProfileData(data);
                    })
                    .catch(err => {
                        console.error("Failed to fetch profile", err);
                    })
                    .finally(() => {
                        setIsFetching(false);
                    });
            }
        }
    }, [user, authLoading, router]);

    if (authLoading || isFetching || !profileData) {
        return (
            <div className="container py-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-2xl" />
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} className="h-24 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const { user: userData, stats } = profileData;

    // Map backend response to component expectations
    const safeUser = {
        ...userData,
        reputation: stats.reputation,
        createdAt: userData.joined_at,
        bio: userData.bio || "Active PromptForge Developer",
        username: userData.username || "Developer"
    };

    const safeStats = {
        promptsCreated: stats.prompts_created,
        forksCreated: stats.forks,
        bookmarksSaved: stats.bookmarks,
        totalLikes: stats.reputation / 5, // Approximate for display
        totalForks: stats.forks,
        totalViews: stats.prompts_created * 10 // Approximate for display
    };

    return (
        <div className="container py-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                 <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                 <Link href={`/user/${userData.username || userData.id}`}>
                    <Button variant="outline" className="gap-2">
                        View Public Profile
                    </Button>
                 </Link>
            </div>
            
            <ProfileHeader user={safeUser} />
            <ProfileStats stats={safeStats} reputation={safeUser.reputation} />
            
            <div className="bg-card border border-border/50 rounded-2xl p-8 text-center space-y-4 shadow-sm">
                <h3 className="text-xl font-semibold">Welcome back, {userData.username}!</h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    You're currently viewing your private profile overview. 
                    From here you can see your statistics and achievements.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <Link href="/upload">
                        <Button className="bg-accent hover:bg-accent/90">Create New Prompt</Button>
                    </Link>
                    <Link href="/explore">
                        <Button variant="ghost">Browse Feed</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <ProfileErrorBoundary>
            <ProfileContent />
        </ProfileErrorBoundary>
    );
}
