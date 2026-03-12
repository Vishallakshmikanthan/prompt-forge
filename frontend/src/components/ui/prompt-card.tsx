import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, GitFork, MessageSquare } from "lucide-react";
import Link from "next/link";

interface PromptCardProps {
    title: string;
    description: string;
    category: string;
    author: string;
    stats: {
        likes: number;
        forks: number;
        comments: number;
    };
}

export function PromptCard({ title, description, category, author, stats }: PromptCardProps) {
    return (
        <Card className="flex flex-col h-full hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                            {title}
                        </CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">
                            {description}
                        </CardDescription>
                    </div>
                    <Badge variant="secondary" className="shrink-0">{category}</Badge>
                </div>
            </CardHeader>

            <CardContent className="flex-grow pb-4">
                <div className="text-sm text-muted-foreground flex items-center gap-1.5 line-clamp-1">
                    By {" "}
                    <Link
                        href={`/user/${author}`}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        className="font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                    >
                        {author}
                    </Link>
                </div>
            </CardContent>

            <CardFooter className="pt-4 border-t flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 hover:text-primary transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>{stats.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-primary transition-colors">
                        <GitFork className="w-4 h-4" />
                        <span>{stats.forks}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 hover:text-primary transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>{stats.comments}</span>
                </div>
            </CardFooter>
        </Card>
    );
}
