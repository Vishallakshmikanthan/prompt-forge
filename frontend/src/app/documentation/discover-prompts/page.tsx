import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Search, ArrowLeft } from "lucide-react";

export default function DiscoverPromptsPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white py-24 px-6">
            <div className="container mx-auto max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
                
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                        <Search size={14} className="text-cyan-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Documentation</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Discover <span className="text-cyan-400">Proven Prompts</span>
                    </h1>
                    
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">
                        Learn how to find and use the most effective prompts for your development workflow. 
                        Our platform curates prompts that have been tested and verified by the community.
                    </p>
                    
                    <div className="grid gap-6 mt-12">
                        {[
                            {
                                title: "Search with Precision",
                                description: "Use our advanced filtering to find prompts by model, task, or programming language."
                            },
                            {
                                title: "Check Verification Shields",
                                description: "Look for prompts with verification badges, indicating they've passed quality benchmarks."
                            },
                            {
                                title: "Fork & Customize",
                                description: "Found a good starting point? Fork any prompt to refine it for your specific needs."
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex gap-4">
                                <CheckCircle className="text-cyan-400 shrink-0 mt-1" size={20} />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                    <p className="text-zinc-400">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="pt-12">
                        <Link href="/categories">
                            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500">
                                Start Browsing Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
