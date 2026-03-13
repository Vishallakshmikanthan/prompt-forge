import {
    Cpu,
    Globe,
    PenTool,
    Megaphone,
    BarChart3,
    GraduationCap,
    Briefcase,
    Palette,
    Zap,
    LucideIcon
} from "lucide-react";

export interface Category {
    id: string;
    name: string;
    description: string;
    count: number;
    icon: LucideIcon;
    slug: string;
}

export const CATEGORIES: Category[] = [
    {
        id: "ai-development",
        name: "AI Development",
        description: "Prompts for coding, debugging, and system architecture",
        count: 156,
        icon: Cpu,
        slug: "ai-development",
    },
    {
        id: "web-development",
        name: "Web Development",
        description: "Prompts for frontend, backend, and API development",
        count: 245,
        icon: Globe,
        slug: "web-development",
    },
    {
        id: "content-creation",
        name: "Content Creation",
        description: "Prompts for blogs, storytelling, and social media writing",
        count: 182,
        icon: PenTool,
        slug: "content",
    },
    {
        id: "marketing",
        name: "Marketing",
        description: "Prompts for advertising, SEO, and campaigns",
        count: 134,
        icon: Megaphone,
        slug: "marketing",
    },
    {
        id: "data-analysis",
        name: "Data Analysis",
        description: "Prompts for extracting insights from data",
        count: 98,
        icon: BarChart3,
        slug: "data-analysis",
    },
    {
        id: "education",
        name: "Education",
        description: "Prompts for learning, teaching, and study materials",
        count: 87,
        icon: GraduationCap,
        slug: "education",
    },
    {
        id: "business",
        name: "Business",
        description: "Prompts for productivity, planning, and strategy",
        count: 112,
        icon: Briefcase,
        slug: "business",
    },
    {
        id: "design",
        name: "Design",
        description: "Prompts for UI/UX, creativity, and image generation",
        count: 143,
        icon: Palette,
        slug: "design",
    },
    {
        id: "automation",
        name: "Automation",
        description: "Prompts for AI agents and workflow automation",
        count: 65,
        icon: Zap,
        slug: "automation",
    }
];
