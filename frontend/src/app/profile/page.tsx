"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileErrorBoundary from "@/components/ui/profile-error-boundary";

function ProfileContent() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (user) {
                const username = user.user_metadata?.username || user.id;
                router.replace(`/user/${username}`);
            }
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-muted-foreground">
                    Please login to view your profile.
                </p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
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
