import {
    Code,
    Bot,
    Bug,
    LayoutTemplate,
    Palette,
    MonitorPlay,
    Server,
    Workflow,
    LucideIcon
} from "lucide-react";

export interface Category {
    id: string;
    name: string;
    description: string;
    count: number;
    icon: LucideIcon;
    href: string;
}

export const CATEGORIES: Category[] = [
    {
        id: "web-development",
        name: "Web Development",
        description: "Prompts for building robust and scalable web applications, React components, and APIs.",
        count: 245,
        icon: Code,
        href: "/categories/Web%20Development",
    },
    {
        id: "ai-agents",
        name: "AI Agents",
        description: "System prompts and instructions for specialized AI agents and autonomous workflows.",
        count: 182,
        icon: Bot,
        href: "/categories/AI%20Agents",
    },
    {
        id: "debugging",
        name: "Debugging",
        description: "Effective prompts to help diagnose, explain, and fix complex bug scenarios.",
        count: 156,
        icon: Bug,
        href: "/categories/Debugging",
    },
    {
        id: "architecture",
        name: "Architecture",
        description: "System design prompts for structuring applications, databases, and microservices.",
        count: 98,
        icon: LayoutTemplate,
        href: "/categories/Architecture",
    },
    {
        id: "ui-design",
        name: "UI Design",
        description: "Prompts dedicated to generating responsive, accessible, and beautiful user interfaces.",
        count: 134,
        icon: Palette,
        href: "/categories/UI%20Design",
    },
    {
        id: "animation",
        name: "Animation",
        description: "Framer Motion, CSS animations, and interaction design prompts.",
        count: 87,
        icon: MonitorPlay,
        href: "/categories/Animation",
    },
    {
        id: "devops",
        name: "DevOps",
        description: "Infrastructure as code, CI/CD pipelines, and deployment scripts.",
        count: 112,
        icon: Server,
        href: "/categories/DevOps",
    },
    {
        id: "automation",
        name: "Automation",
        description: "Scripts for automating repetitive tasks, scraping, and data processing.",
        count: 143,
        icon: Workflow,
        href: "/categories/Automation",
    }
];
