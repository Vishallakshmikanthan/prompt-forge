import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ActivityGraph } from "@/components/profile/activity-graph";
import { FeaturedPrompt } from "@/components/profile/featured-prompt";
import { PromptCollections } from "@/components/profile/prompt-collections";
import { Achievements } from "@/components/profile/achievements";
import { AnalyticsChart } from "@/components/profile/analytics-chart";
import { ActivityTimeline } from "@/components/profile/activity-timeline";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Bot } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { userService } from "@/lib/services/userService";

async function getProfileData(username: string) {
    try {
        const [profile, prompts, forks, bookmarks, activityGraph, analytics, featured, collections, timeline] = await Promise.all([
            userService.getUserProfile(username),
            userService.getUserPrompts(username),
            userService.getUserForks(username),
            userService.getUserBookmarks(username),
            userService.getActivityGraph(username).catch(() => ({ days: [], totalContributions: 0 })),
            userService.getAnalytics(username).catch(() => []),
            userService.getFeaturedPrompt(username).catch(() => null),
            userService.getCollections(username).catch(() => []),
            userService.getTimeline(username).catch(() => []),
        ]);

        return { profile, prompts, forks, bookmarks, activityGraph, analytics, featured, collections, timeline };
    } catch (error: any) {
        console.error("Profile fetch failed", error);
        return null;
    }
}

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const data = await getProfileData(username);

    if (!data) {
        notFound();
    }

    const profile = data.profile || {} as any;
    const prompts = data.prompts || [];
    const forks = data.forks || [];
    const bookmarks = data.bookmarks || [];
    const activityGraph = data.activityGraph || { days: [], totalContributions: 0 };
    const analytics = data.analytics || [];
    const featured = data.featured || null;
    const collections = data.collections || [];
    const timeline = data.timeline || [];

    const safeUsername = profile?.username ?? "Anonymous User";
    const safeBio = profile?.bio ?? "No bio added yet";

    const safeUser = {
        ...profile,
        username: safeUsername,
        bio: safeBio,
        reputation: profile?.reputation ?? 0,
        createdAt: profile?.createdAt ?? new Date().toISOString(),
    };

    const safeStats = profile?.stats ?? {
        promptsCreated: 0,
        forksCreated: 0,
        bookmarksSaved: 0,
        totalLikes: 0,
        totalForks: 0,
        totalViews: 0,
    };

    // Generate AI profile summary from real data
    const topCategory = collections.length > 0 ? collections[0].title : "Prompt Engineering";
    const aiSummary = `This developer specializes in ${topCategory} with ${safeStats.promptsCreated} original prompts and ${safeStats.forksCreated} forks. They have earned ${safeUser.reputation.toLocaleString()} reputation from ${(safeStats.totalLikes ?? 0).toLocaleString()} likes, ${(safeStats.totalForks ?? 0).toLocaleString()} forks, and ${(safeStats.totalViews ?? 0).toLocaleString()} views across their portfolio.`;

    return (
        <div className="container py-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <Link href="/">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Explore
                    </Button>
                </Link>
            </div>

            <ProfileHeader user={safeUser} />

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-4 shadow-inner backdrop-blur-md">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm mb-1 text-primary">AI Profile Summary</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed max-w-4xl">
                        {aiSummary}
                    </p>
                </div>
            </div>

            <ProfileStats stats={safeStats} reputation={safeUser.reputation} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-4">
                <div className="xl:col-span-2 space-y-8">
                    <ActivityGraph days={activityGraph.days} totalContributions={activityGraph.totalContributions} />
                    <FeaturedPrompt prompt={featured} />

                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold tracking-tight">Prompt Portfolio</h3>
                        <div className="border border-border/50 rounded-xl p-1 bg-card/40 backdrop-blur-xl shadow-sm">
                            <Suspense fallback={<ProfileTabsSkeleton />}>
                                <ProfileTabs
                                    prompts={prompts}
                                    forks={forks}
                                    bookmarks={bookmarks}
                                />
                            </Suspense>
                        </div>
                    </div>

                    <PromptCollections collections={collections} />
                </div>

                <div className="space-y-8">
                    <Achievements />
                    <ActivityTimeline events={timeline} />
                </div>
            </div>

            <div className="pt-8 w-full">
                <AnalyticsChart data={analytics} />
            </div>
        </div>
    );
}

function ProfileTabsSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex gap-2 border-b pb-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-24" />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-[300px] rounded-xl" />
                ))}
            </div>
        </div>
    );
}
