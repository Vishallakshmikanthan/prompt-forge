"use client";

import { useState } from "react";
import { LinkIcon, CalendarIcon, Github, Star, Award, Shield, Trophy, Edit, MapPin, Code } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "./edit-profile-modal";
import { Avatar } from "./avatar";

interface ProfileHeaderProps {
    user: {
        username: string;
        displayName?: string | null;
        reputation: number;
        bio?: string | null;
        avatarUrl?: string | null;
        githubUrl?: string | null;
        website?: string | null;
        location?: string | null;
        skills?: string[] | any;
        createdAt: string | Date;
    };
    isOwner?: boolean;
    onUpdateProfile?: (updatedUser: any) => void;
}

export function ProfileHeader({ user, isOwner = true, onUpdateProfile }: ProfileHeaderProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const getBadgeInfo = (reputation: number) => {
        if (reputation >= 1000) return { label: "Master", icon: Trophy, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
        if (reputation >= 500) return { label: "Expert", icon: Shield, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" };
        if (reputation >= 100) return { label: "Contributor", icon: Award, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
        return { label: "Beginner", icon: Star, color: "bg-slate-500/10 text-slate-500 border-slate-500/20" };
    };

    const badge = getBadgeInfo(user.reputation || 0);

    const handleSave = (updatedUser: any) => {
        if (onUpdateProfile) {
            onUpdateProfile(updatedUser);
        }
    };

    const displaySkills = Array.isArray(user.skills) ? user.skills : [];

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 md:p-8 bg-card rounded-xl border border-border/50 shadow-sm relative overflow-hidden group">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500" />

            {/* Edit Button for Owner */}
            {isOwner && (
                <div className="absolute top-4 right-4 z-20">
                    <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)} className="gap-2">
                        <Edit className="w-4 h-4" />
                        Edit Profile
                    </Button>
                </div>
            )}

            <Avatar
                src={user.avatarUrl}
                username={user.username}
                size="xl"
                className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-md z-10"
            />

            <div className="flex-1 space-y-4 z-10 w-full">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            {user.displayName || user.username}
                        </h1>
                        {user.displayName && (
                            <span className="text-xl text-muted-foreground font-medium">@{user.username}</span>
                        )}
                        <Badge variant="outline" className={`flex items-center gap-1 py-1 px-3 rounded-full font-medium ${badge.color}`}>
                            <badge.icon className="h-3.5 w-3.5" />
                            {badge.label}
                        </Badge>
                        <div className="flex items-center gap-1 bg-primary/5 text-primary text-xs font-bold px-2.5 py-1 rounded-full border border-primary/10">
                            ⭐ {user.reputation || 0} Reputation
                        </div>
                    </div>
                    {user.bio ? (
                        <p className="text-muted-foreground mt-1 max-w-2xl leading-relaxed">{user.bio}</p>
                    ) : (
                        <p className="text-muted-foreground italic mt-1">This user hasn't added a bio yet.</p>
                    )}
                </div>

                {displaySkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {displaySkills.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="bg-secondary/50 flex items-center gap-1">
                                <Code className="w-3 h-3" />
                                {skill}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5">
                        <CalendarIcon className="h-4 w-4 shrink-0" />
                        <span>Joined {format(new Date(user.createdAt), "MMMM yyyy")}</span>
                    </div>

                    {user.location && (
                        <div className="flex items-center gap-1.5">
                            <span className="opacity-50 hidden md:inline">•</span>
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span>{user.location}</span>
                        </div>
                    )}

                    {(user.website || user.githubUrl) && (
                        <div className="flex items-center gap-3">
                            <span className="opacity-50 hidden xl:inline">•</span>

                            {user.website && (
                                <a
                                    href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                                >
                                    <LinkIcon className="h-4 w-4 shrink-0" />
                                    <span className="truncate max-w-[200px]">{user.website.replace(/^https?:\/\//, '')}</span>
                                </a>
                            )}

                            {user.githubUrl && (
                                <>
                                    {user.website && <span className="opacity-50 hidden sm:inline">•</span>}
                                    <a
                                        href={user.githubUrl.startsWith('http') ? user.githubUrl : `https://${user.githubUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 hover:text-primary transition-colors"
                                    >
                                        <Github className="h-4 w-4 shrink-0" />
                                        <span>GitHub</span>
                                    </a>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
                onSave={handleSave}
            />
        </div>
    );
}
