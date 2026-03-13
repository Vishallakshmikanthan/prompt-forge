"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PromptForm, type PromptFormData } from "@/components/upload/prompt-form";
import { PromptPreview } from "@/components/upload/prompt-preview";
import { useAuth } from "@/components/auth/auth-provider";
import { AnimatedStepper } from "@/components/ui/animated-stepper";

import { useSearchParams } from "next/navigation";

export default function UploadPage() {
    const [previewData, setPreviewData] = useState<Partial<PromptFormData>>({});
    const [initialForkData, setInitialForkData] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }

        const isFork = searchParams.get("fork") === "true";
        if (isFork && typeof window !== "undefined") {
            const savedData = sessionStorage.getItem("promptforge_fork_data");
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    setInitialForkData({
                        title: `${parsed.title} (Forked)`,
                        description: parsed.description,
                        category: parsed.category,
                        ai_model: parsed.aiModel,
                        tags: parsed.tags,
                        prompt_preview: parsed.promptContent,
                        parentPromptId: parsed.parentPromptId,
                    });
                    // Set preview right away
                    setPreviewData({
                        title: `${parsed.title} (Forked)`,
                        description: parsed.description,
                    });
                    // Clean up
                    sessionStorage.removeItem("promptforge_fork_data");
                } catch (e) {
                    console.error("Failed to parse fork data", e);
                }
            }
        }
    }, [user, isLoading, router, searchParams]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/10">
                <div className="h-8 w-8 rounded-full border-2 border-accent border-r-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col pt-24 pb-20 bg-muted/10">
            <div className="container mx-auto px-4 mb-10 text-center max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    Publish a Prompt
                </h1>
                <p className="text-xl text-muted-foreground">
                    Share your optimized AI prompts with the community. Structure your inputs carefully to help others succeed.
                </p>
            </div>

            <div className="container mx-auto px-4 mb-8 max-w-4xl">
                <AnimatedStepper
                    steps={["Write Prompt", "Preview Prompt", "Publish Prompt"]}
                    currentStep={currentStep}
                />
            </div>

            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: Form (Takes up 7 out of 12 columns on large screens) */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full mb-8 lg:mb-0">
                        <PromptForm
                            key={initialForkData ? "fork" : "new"}
                            onFormChange={setPreviewData}
                            initialData={initialForkData}
                        />
                    </div>

                    {/* Right Column: Live Preview (Sticky) */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="sticky top-24 bg-card p-6 rounded-xl border shadow-sm">
                            <PromptPreview promptData={previewData} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
