"use client"

import * as React from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { SidebarToggle } from "./sidebar-toggle"
import { Sidebar } from "./sidebar"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button"
import { LogoutButton } from "@/components/auth/logout-button"
import { UserAvatar } from "@/components/auth/user-avatar"
import { useAuth } from "@/components/auth/auth-provider"

export function SiteHeader() {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
    const { user, isLoading } = useAuth()

    return (
        <>
            <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto space-x-4 sm:space-x-0">
                    <div className="flex items-center gap-2 md:gap-4 flex-1">
                        <SidebarToggle onToggle={() => setIsSidebarOpen(true)} />

                        <Link href="/" className="flex items-center space-x-2 mr-6">
                            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-primary-foreground font-bold hidden sm:flex">
                                P
                            </div>
                            <span className="font-bold text-xl tracking-tight hidden sm:inline-block text-foreground">
                                PromptForge
                            </span>
                        </Link>
                    </div>

                    <div className="flex flex-1 items-center justify-end space-x-4">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                                if (query.trim()) {
                                    window.location.href = `/search?q=${encodeURIComponent(query)}`;
                                }
                            }}
                            className="w-full max-w-sm hidden md:flex items-center relative group"
                        >
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                            <input
                                name="search"
                                type="text"
                                placeholder="Search prompts meaning... (e.g. 'code generator')"
                                className="flex h-10 w-full rounded-full border border-border bg-muted/40 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50 pl-10 transition-all duration-300 hover:bg-muted"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs">ENTER</span>
                                </kbd>
                            </div>
                        </form>

                        <nav className="flex items-center space-x-4">
                            <ThemeToggle />
                            {!isLoading && (
                                user ? (
                                    <div className="flex items-center gap-4">
                                        <LogoutButton />
                                        <UserAvatar />
                                    </div>
                                ) : (
                                    <LoginButton />
                                )
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
        </>
    )
}
