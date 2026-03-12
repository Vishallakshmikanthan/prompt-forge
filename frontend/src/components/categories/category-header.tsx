import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface CategoryHeaderProps {
    title: string;
    description: string;
    promptCount: number;
    icon: LucideIcon;
}

export function CategoryHeader({ title, description, promptCount, icon: Icon }: CategoryHeaderProps) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                {title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                {description}
            </p>
            <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                    {promptCount} {promptCount === 1 ? 'Prompt' : 'Prompts'}
                </Badge>
            </div>
        </div>
    );
}
