"use client"

import { SplineScene } from "@/components/ui/splite"
import { Spotlight } from "@/components/ui/spotlight"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function SplineHero() {
    const { user } = useAuth()
    const router = useRouter()

    const handleUploadClick = () => {
        if (!user) {
            alert("Please login to upload prompts")
            router.push("/login")
        } else {
            router.push("/upload")
        }
    }

    return (
        <section className="relative min-h-[800px] w-full flex items-center bg-zinc-950 overflow-hidden py-20">

            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
            />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT CONTENT */}
                    <div className="flex flex-col space-y-8">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
                                Master the Art of <br />
                                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-500 bg-clip-text text-transparent italic">
                                    Prompt Engineering
                                </span>
                            </h1>

                            <p className="mt-6 max-w-lg text-lg text-zinc-400">
                                The ultimate platform for developers to discover, test, and
                                share high-performance AI prompts. Elevate your LLM workflows
                                with PromptForge.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex gap-4 flex-wrap"
                        >
                            <Link href="/categories">
                                <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8">
                                    Browse Categories
                                </Button>
                            </Link>

                            <Button
                                size="lg"
                                variant="outline"
                                className="border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                                onClick={handleUploadClick}
                            >
                                Upload Prompt
                            </Button>
                        </motion.div>

                        <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-zinc-500">
                            <div className="h-[1px] w-12 bg-zinc-800" />
                            Trusted by 50,000+ developers
                        </div>

                    </div>

                    {/* RIGHT SPLINE */}
                    <div className="relative w-full h-[500px] lg:h-[700px]">

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0"
                        >
                            <SplineScene
                                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                                className="w-full h-full"
                            />
                        </motion.div>

                    </div>

                </div>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />

        </section>
    )
}
