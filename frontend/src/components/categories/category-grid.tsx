import { CategoryCard } from "./category-card";
import { CATEGORIES } from "@/lib/mock-categories";
import { cn } from "@/lib/utils";

interface CategoryGridProps {
    className?: string;
}

export function CategoryGrid({ className }: CategoryGridProps) {
    return (
        <div className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
            className
        )}>
            {CATEGORIES.map((category) => (
                <CategoryCard
                    key={category.id}
                    name={category.name}
                    description={category.description}
                    count={category.count}
                    icon={category.icon}
                    href={category.href}
                />
            ))}
        </div>
    );
}
