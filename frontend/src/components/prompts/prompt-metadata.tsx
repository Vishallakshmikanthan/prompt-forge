import { CalendarRange, RotateCcw, User, Clock, Eye, ThumbsUp, GitFork, Bookmark } from "lucide-react";

interface PromptMetadataProps {
    author: string;
    createdAt: string;
    version?: string;
    views?: number;
    votes?: number;
    forks?: number;
    bookmarks?: number;
}

export function PromptMetadata({
    author,
    createdAt,
    version = "1.0.0",
    views = 0,
    votes = 0,
    forks = 0,
    bookmarks = 0
}: PromptMetadataProps) {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(createdAt));

    return (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 gap-y-6 gap-x-4 p-6 sm:p-8 bg-muted/20 border rounded-xl">
            <div className="flex flex-col gap-1 min-w-0">
                <span className="flex items-center text-xs font-medium text-muted-foreground mb-1 whitespace-nowrap">
                    <User className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    Author
                </span>
                <span className="text-sm font-semibold truncate" title={author}>{author}</span>
            </div>

            <div className="flex flex-col gap-1 min-w-0">
                <span className="flex items-center text-xs font-medium text-muted-foreground mb-1 whitespace-nowrap">
                    <CalendarRange className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    Created
                </span>
                <span className="text-sm font-semibold truncate" title={formattedDate}>{formattedDate}</span>
            </div>

            <div className="flex flex-col gap-1 min-w-0">
                <span className="flex items-center text-xs font-medium text-muted-foreground mb-1 whitespace-nowrap">
                    <Clock className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    Last Updated
                </span>
                <span className="text-sm font-semibold truncate" title={formattedDate}>{formattedDate}</span>
            </div>

            <div className="flex flex-col gap-1 min-w-0">
                <span className="flex items-center text-xs font-medium text-muted-foreground mb-1 whitespace-nowrap">
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    Version
                </span>
                <span className="text-sm font-semibold truncate" title={`v${version}`}>v{version}</span>
            </div>

            {/* Analytics Metrics */}
            <div className="flex flex-col gap-1 pt-2 border-t min-w-0">
                <span className="flex items-center text-xs font-medium text-muted-foreground mb-1 whitespace-nowrap">
                    <Eye className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    Views
                </span>
                <span className="text-sm font-semibold truncate">{views.toLocaleString()}</span>
            </div>

            <div className="flex flex-col gap-1 pt-2 border-t min-w-0">
                <span className="flex items-center text-xs font-medium text-muted-foreground mb-1 whitespace-nowrap">
                    <ThumbsUp className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    Votes
                </span>
                <span className="text-sm font-semibold truncate">{votes.toLocaleString()}</span>
            </div>

            <div className="flex flex-col gap-1 pt-2 border-t min-w-0">
                <span className="flex items-center text-xs font-medium text-muted-foreground mb-1 whitespace-nowrap">
                    <GitFork className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    Forks
                </span>
                <span className="text-sm font-semibold truncate">{forks.toLocaleString()}</span>
            </div>

            <div className="flex flex-col gap-1 pt-2 border-t min-w-0">
                <span className="flex items-center text-xs font-medium text-muted-foreground mb-1 whitespace-nowrap">
                    <Bookmark className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    Bookmarks
                </span>
                <span className="text-sm font-semibold truncate">{bookmarks.toLocaleString()}</span>
            </div>
        </div>
    );
}
