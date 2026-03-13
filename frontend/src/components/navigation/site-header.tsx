"use client"

import * as React from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { SidebarToggle } from "./sidebar-toggle"
import { Sidebar } from "./sidebar"
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button"
import { LogoutButton } from "@/components/auth/logout-button"
import { UserAvatar } from "@/components/auth/user-avatar"
import { useAuth } from "@/components/auth/auth-provider"

import Image from "next/image"

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
                            <Image
                                src="/logo.png"
                                alt="PromptForge Logo"
                                width={36}
                                height={36}
                                className="rounded-lg"
                            />
                            <span className="font-bold text-xl tracking-tight hidden sm:inline-block text-foreground">
                                PromptForge
                            </span>
                        </Link>
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-6">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                                if (query.trim()) {
                                    window.location.href = `/search?q=${encodeURIComponent(query)}`;
                                }
                            }}
                            className="w-80 px-4 py-2 rounded-xl border border-border hidden md:flex items-center relative group bg-muted/40 transition-all duration-300 hover:bg-muted/70 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent"
                        >
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                            <input
                                name="search"
                                type="text"
                                placeholder="Search prompts..."
                                className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 pl-6 pr-10"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs">↵</span>
                                </kbd>
                            </div>
                        </form>

                        <nav className="hidden lg:flex items-center space-x-6 mr-4">
                            <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
                                Explore
                            </Link>
                            <Link href="/community" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
                                Community
                            </Link>
                            <Link href="/documentation" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
                                Docs
                            </Link>
                        </nav>

                        <nav className="flex items-center space-x-3">
                            {!isLoading && (
                                user ? (
                                    <div className="flex items-center gap-4">
                                        <Link 
                                            href={`/user/${user.user_metadata?.username || user.id}`} 
                                            className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors mr-2"
                                        >
                                            <span className="hidden xl:inline">Profile</span>
                                        </Link>
                                        <LogoutButton />
                                        <UserAvatar />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Link href="/login">
                                            <Button variant="ghost" className="text-sm font-medium hover:text-accent transition-colors">
                                                Login
                                            </Button>
                                        </Link>
                                        <Link href="/signup">
                                            <Button variant="default" className="bg-accent hover:bg-accent/90 text-primary-foreground font-medium shadow-lg hover:shadow-accent/25 transition-all text-sm">
                                                Sign Up
                                            </Button>
                                        </Link>
                                    </div>
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
