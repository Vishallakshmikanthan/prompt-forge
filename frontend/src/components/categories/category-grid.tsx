"use client";

import { CategoryCard } from "./category-card";
import { CATEGORIES } from "@/lib/mock-categories";
import { cn } from "@/lib/utils";

interface CategoryGridProps {
    className?: string;
    categoryStats?: { category: string; promptCount: number }[];
}

export function CategoryGrid({ className, categoryStats = [] }: CategoryGridProps) {
    return (
        <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
            className
        )}>
            {CATEGORIES.map((category) => {
                // Find matching count from dynamic stats
                const dynamicStat = categoryStats.find(s => 
                    s.category.toLowerCase() === category.name.toLowerCase()
                );
                
                return (
                    <CategoryCard
                        key={category.id}
                        name={category.name}
                        description={category.description}
                        count={dynamicStat ? dynamicStat.promptCount : 0}
                        icon={category.icon}
                        slug={category.slug}
                    />
                );
            })}
        </div>
    );
}
