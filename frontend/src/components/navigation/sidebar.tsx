"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Compass, Upload, LayoutGrid, Users, User, X } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname()
    const { user, isLoading } = useAuth()

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "Explore", href: "/explore", icon: Compass },
        { name: "Categories", href: "/categories", icon: LayoutGrid },
        { name: "Upload Prompt", href: "/upload", icon: Upload },
        { name: "Community", href: "/community", icon: Users },
        {
            name: "Profile",
            href: "/profile",
            icon: User
        },
    ]

    // Prevent scrolling when sidebar is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 left-0 z-50 w-full md:w-80 bg-background border-r border-border shadow-2xl flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <Link href="/" onClick={onClose} className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-primary-foreground font-bold">
                                    P
                                </div>
                                <span className="font-bold text-xl tracking-tight">PromptForge</span>
                            </Link>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                                aria-label="Close menu"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                            {navItems.map((item, i) => {
                                const isActive = pathname === item.href
                                return (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.05 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                                ? "text-accent bg-accent/10 font-medium"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                }`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-indicator"
                                                    className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                />
                                            )}
                                            <item.icon className={`h-5 w-5 z-10 ${isActive ? "text-accent" : "group-hover:text-foreground"}`} />
                                            <span className="z-10">{item.name}</span>

                                            {/* Hover effect background */}
                                            {!isActive && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            )}
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </div>

                        <div className="p-6 border-t border-border bg-muted/20">
                            {user ? (
                                <Link
                                    href="/profile"
                                    onClick={onClose}
                                    className="flex items-center space-x-3 px-2 group cursor-pointer"
                                >
                                    <div className="h-10 w-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent overflow-hidden group-hover:border-accent transition-colors">
                                        {user?.user_metadata?.avatar_url ? (
                                            <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <User size={18} />
                                        )}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                                            {user?.user_metadata?.username || user?.email || "User"}
                                        </span>
                                        <span className="text-xs text-muted-foreground">View Profile</span>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex items-center space-x-3 px-2">
                                    <div className="h-10 w-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent overflow-hidden">
                                        <User size={18} />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm font-medium truncate">Guest User</span>
                                        <span className="text-xs text-muted-foreground">Sign in to save prompts</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
