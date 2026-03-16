"use client"

import * as React from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarToggleProps {
    onToggle: () => void
    className?: string
}

export function SidebarToggle({ onToggle, className }: SidebarToggleProps) {
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn("relative overflow-hidden group hover:bg-transparent", className)}
            aria-label="Toggle menu"
        >
            <div className="relative flex items-center justify-center w-full h-full transition-transform duration-300 group-hover:scale-110">
                <Menu className="h-5 w-5 text-foreground group-hover:text-accent transition-colors" />
            </div>
        </Button>
    )
}
