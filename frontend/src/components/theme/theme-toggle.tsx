"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { LuminousSwitch } from "@/components/ui/luminous-switch"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Wait until mounted to avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="h-6 w-11 bg-zinc-800 rounded-full animate-pulse" />

    const isDark = theme === "dark"

    return (
        <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-zinc-500" />
            <LuminousSwitch
                checked={isDark}
                onChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
            <Moon className="h-4 w-4 text-zinc-500" />
            <span className="sr-only">Toggle theme</span>
        </div>
    )
}
