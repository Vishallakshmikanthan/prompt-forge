"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Terminal, Copy, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { SparklesCore } from "@/components/backgrounds/sparkles"
import Link from "next/link"

const codeSnippet = `// Integrate PromptForge in seconds
import { PromptForge } from '@promptforge/sdk';

const client = new PromptForge({ apiKey: process.env.PF_KEY });

// Execute a strongly-typed prompt template
const result = await client.prompts.execute('user/data-extraction', {
  variables: { 
    text: "Extract all companies from this article...",
    format: "json"
  },
  model: "gpt-4-turbo"
});

console.log(result.data);`;

export function DeveloperFocusSection() {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(codeSnippet)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <section className="py-32 relative bg-background text-foreground border-y border-border/50 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <SparklesCore
                    background="transparent"
                    minSize={0.4}
                    maxSize={1}
                    particleDensity={100}
                    className="w-full h-full opacity-30"
                    particleColor="#FFFFFF"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                            <Terminal className="w-4 h-4 text-[#7c5cff]" />
                            <span className="text-sm font-mono tracking-wider">DEVELOPER API</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 font-display">
                            Built for <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#7c5cff] to-[#a48cff]">Engineers</span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed">
                            No more messy spreadsheets or hardcoded strings. Manage your AI prompts
                            like code with versioning, CI/CD integration, and strongly-typed execution.
                        </p>

                        <ul className="space-y-4 mb-8">
                            {['TypeScript SDK with complete typings', 'React & Next.js first-class support', 'Edge computing compatible'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 className="w-5 h-5 text-[#7c5cff]" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href="/documentation">
                            <Button className="rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all h-12 px-8 font-semibold">
                                Read Documentation
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#7c5cff] to-[#45329c] blur opacity-20" />
                        <div className="relative rounded-3xl bg-card border border-border/50 overflow-hidden shadow-2xl">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>
                                    <span className="ml-2 text-xs font-mono text-gray-500">integration.ts</span>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                >
                                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="p-6 overflow-x-auto text-sm md:text-base font-mono">
                                <pre className="text-gray-300">
                                    <code dangerouslySetInnerHTML={{ __html: codeSnippet.replace(/PromptForge/g, '<span class="text-[#7c5cff]">PromptForge</span>').replace(/client/g, '<span class="text-blue-400">client</span>').replace(/execute/g, '<span class="text-yellow-200">execute</span>').replace(/"gpt-4-turbo"/g, '<span class="text-green-300">"gpt-4-turbo"</span>').replace(/'user\/data-extraction'/g, '<span class="text-green-300">\'user/data-extraction\'</span>') }} />
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
