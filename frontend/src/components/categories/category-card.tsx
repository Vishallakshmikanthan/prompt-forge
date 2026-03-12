import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
    name: string;
    description: string;
    count: number;
    icon: LucideIcon;
    href: string;
}

export function CategoryCard({ name, description, count, icon: Icon, href }: CategoryCardProps) {
    return (
        <Link href={href} className="block group">
            <Card className="h-full bg-background border hover:border-primary/50 hover:shadow-md transition-all duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
                    <div className="mt-auto px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                        {count} Prompts
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
