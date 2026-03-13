import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Layout, CheckCircle, ArrowLeft } from "lucide-react";

export default function StructuredDesignPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white py-24 px-6">
            <div className="container mx-auto max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
                
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                        <Layout size={14} className="text-purple-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Documentation</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Structured <span className="text-purple-400">Design</span>
                    </h1>
                    
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">
                        Prompts on PromptForge aren't just text. They are structured objects with clear inputs, 
                        expected outputs, and version control.
                    </p>
                    
                    <div className="grid gap-6 mt-12">
                        {[
                            {
                                title: "Variable Injection",
                                description: "Define clear placeholders like {{code}} or {{task}} to make your prompts reusable."
                            },
                            {
                                title: "Context Management",
                                description: "Separate system instructions, user input, and reference data for better model performance."
                            },
                            {
                                title: "Output Formatting",
                                description: "Enforce specific formats like JSON, Markdown, or specific code structures easily."
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex gap-4">
                                <CheckCircle className="text-purple-400 shrink-0 mt-1" size={20} />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                    <p className="text-zinc-400">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="pt-12">
                        <Link href="/upload">
                            <Button size="lg" className="bg-purple-600 hover:bg-purple-500">
                                Create a Structured Prompt
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
