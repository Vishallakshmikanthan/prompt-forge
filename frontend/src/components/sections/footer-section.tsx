import Link from "next/link";
import { Terminal } from "lucide-react";

export function FooterSection() {
    return (
        <footer className="bg-background border-t py-12 md:py-16">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <Terminal className="w-6 h-6 text-primary" />
                            <span className="text-xl font-bold tracking-tight">PromptForge</span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm">
                            The premier platform for software engineers and designers to discover, share, and version structured AI prompts.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Platform</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/explore" className="hover:text-primary transition-colors">Explore Prompts</Link></li>
                            <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
                            <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
                            <li><Link href="/trending" className="hover:text-primary transition-colors">Trending</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Resources</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/documentation" className="hover:text-primary transition-colors">Documentation</Link></li>
                            <li><Link href="/api-reference" className="hover:text-primary transition-colors">API Reference</Link></li>
                            <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
                            <li><Link href="/github" className="hover:text-primary transition-colors">GitHub</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} PromptForge. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="hover:text-foreground">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
