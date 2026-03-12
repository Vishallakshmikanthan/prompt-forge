import Link from "next/link";
import { useAuth } from "./auth-provider";

export function UserAvatar() {
    const { user, isLoading } = useAuth();

    if (isLoading || !user) return null;

    const avatarUrl = user.user_metadata?.avatar_url;
    const username = user.user_metadata?.username || user.id;
    const name = user.user_metadata?.full_name || user.email;

    return (
        <Link href={`/user/${username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={name}
                    className="h-8 w-8 rounded-full border border-border"
                    referrerPolicy="no-referrer"
                />
            ) : (
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {name?.[0]?.toUpperCase() || "U"}
                </div>
            )}
        </Link>
    );
}
