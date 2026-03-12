import Image from "next/image";
import { User } from "lucide-react";

interface AvatarProps {
    src?: string | null;
    username: string;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
};

export function Avatar({ src, username, size = "md", className = "" }: AvatarProps) {
    const dicebearUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`;
    const finalSrc = src || dicebearUrl;

    return (
        <div
            className={`relative overflow-hidden rounded-full border border-border bg-muted flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}
        >
            {finalSrc ? (
                <Image
                    src={finalSrc}
                    alt={`${username}'s avatar`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                />
            ) : (
                <User className="w-1/2 h-1/2 text-muted-foreground" />
            )}
        </div>
    );
}
