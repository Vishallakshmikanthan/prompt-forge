"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TagInput } from "./tag-input";
import { PromptEditor } from "./prompt-editor";
import { ValidationResultPanel } from "./validation-result-panel";
import { CATEGORIES } from "@/lib/mock-categories";
import { runFullValidation, type FullValidationResult } from "@/lib/validation/prompt-validator";
import { Send, Save, ShieldCheck } from "lucide-react";
import { promptService } from "@/lib/services/promptService";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { toast } from "sonner";

export interface PromptFormData {
    title: string;
    description: string;
    category: string;
    ai_model: string;
    tags: string[];
    prompt_preview: string;
}

const MODELS = ["GPT", "Claude", "Gemini", "Cursor", "Antigravity"];

interface PromptFormProps {
    onFormChange: (data: PromptFormData) => void;
    initialData?: Partial<PromptFormData> & { parentPromptId?: string };
}

export function PromptForm({ onFormChange, initialData }: PromptFormProps) {
    const { user } = useAuth();
    const [formData, setFormData] = useState<PromptFormData>({
        title: initialData?.title || "",
        description: initialData?.description || "",
        category: initialData?.category || "",
        ai_model: initialData?.ai_model || "",
        tags: initialData?.tags || [],
        prompt_preview: initialData?.prompt_preview || ""
    });

    const [parentPromptId] = useState<string | undefined>(initialData?.parentPromptId);

    // Field-level errors (shown inline as user types)
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof PromptFormData, string>>>({});
    const [validationResult, setValidationResult] = useState<FullValidationResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const updateField = (field: keyof PromptFormData, value: string | string[]) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
        onFormChange(newData);
        // Clear inline error for this field when user starts fixing it
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: undefined }));
        }
        // Re-run validation live if a result is already shown
        if (validationResult) {
            const result = runFullValidation(newData);
            setValidationResult(result);
        }
    };

    const handlePublish = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Run the full 4-step pipeline
        const result = runFullValidation(formData);
        setValidationResult(result);

        // Propagate structure errors to individual field labels
        if (!result.structureResult.passed) {
            const structureErrors = result.structureResult.errors as Partial<Record<keyof PromptFormData, string>>;
            setFieldErrors(structureErrors);
        } else {
            setFieldErrors({});
        }

        if (result.isBlocked) {
            // Scroll to validation panel smoothly
            setTimeout(() => {
                document.getElementById("validation-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 100);
            setIsSubmitting(false);
            return;
        }

        if (!user) {
            toast.error("You must be logged in to publish a prompt");
            setIsSubmitting(false);
            return;
        }

        // Post the prompt to the backend.
        promptService.createPrompt({
            title: formData.title,
            description: formData.description,
            promptContent: formData.prompt_preview,
            category: formData.category,
            aiModel: formData.ai_model,
            tags: formData.tags,
            authorId: user.id,
            parentPromptId: parentPromptId,
            securityWarnings: result.securityWarnings,
            username: user.user_metadata?.username || user.email, // Fallback to email if no username
            email: user.email,
            avatarUrl: user.user_metadata?.avatar_url
        }).then((newPrompt) => {
            const scoreMsg = newPrompt.qualityScore ? ` (Quality Score: ${newPrompt.qualityScore})` : "";
            if (newPrompt.moderationStatus === 'flagged') {
                toast.warning(`Prompt submitted but flagged for review${scoreMsg}. It will be visible once approved.`);
            } else {
                toast.success(`Prompt successfully published!${scoreMsg}`);
            }
            setIsSubmitting(false);
            router.push(`/prompt/${newPrompt.id}`);
        }).catch((err) => {
            console.error(err);
            toast.error("Failed to publish prompt: " + err.message);
            setIsSubmitting(false);
        });
    };

    const handleSaveDraft = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log("💾 Mock Submission - Saving Draft:", formData);
        alert("Draft saved! Check the browser console.");
    };

    return (
        <form onSubmit={handlePublish} className="space-y-8 flex flex-col h-full">
            <div className="space-y-6 flex-1">
                {/* Basic Info */}
                <div className="space-y-4 p-6 border rounded-xl bg-card">
                    <h3 className="font-semibold text-lg mb-4">Basic Information</h3>

                    <div className="space-y-2">
                        <Label htmlFor="title" className={fieldErrors.title ? "text-destructive" : ""}>
                            Prompt Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g. Next.js App Router Setup Expert"
                            value={formData.title}
                            onChange={(e) => updateField("title", e.target.value)}
                            className={fieldErrors.title ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {fieldErrors.title && <p className="text-xs text-destructive">{fieldErrors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className={fieldErrors.description ? "text-destructive" : ""}>
                            Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Briefly describe what this prompt accomplishes and when to use it..."
                            value={formData.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("description", e.target.value)}
                            className={fieldErrors.description ? "border-destructive focus-visible:ring-destructive" : "resize-none h-24"}
                        />
                        {fieldErrors.description && <p className="text-xs text-destructive">{fieldErrors.description}</p>}
                    </div>
                </div>

                {/* Categorization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 border rounded-xl bg-card">
                    <div className="space-y-2">
                        <Label className={fieldErrors.category ? "text-destructive" : ""}>
                            Category <span className="text-destructive">*</span>
                        </Label>
                        <Select value={formData.category} onValueChange={(val) => updateField("category", val as string)}>
                            <SelectTrigger className={fieldErrors.category ? "border-destructive" : ""}>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(cat => (
                                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {fieldErrors.category && <p className="text-xs text-destructive">{fieldErrors.category}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className={fieldErrors.ai_model ? "text-destructive" : ""}>
                            Optimized For <span className="text-destructive">*</span>
                        </Label>
                        <Select value={formData.ai_model} onValueChange={(val) => updateField("ai_model", val as string)}>
                            <SelectTrigger className={fieldErrors.ai_model ? "border-destructive" : ""}>
                                <SelectValue placeholder="Select AI Model" />
                            </SelectTrigger>
                            <SelectContent>
                                {MODELS.map(model => (
                                    <SelectItem key={model} value={model}>{model}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {fieldErrors.ai_model && <p className="text-xs text-destructive">{fieldErrors.ai_model}</p>}
                    </div>

                    <div className="col-span-1 sm:col-span-2 space-y-2 mt-2">
                        <Label>Tags</Label>
                        <TagInput
                            tags={formData.tags}
                            onTagsChange={(tags) => updateField("tags", tags)}
                        />
                    </div>
                </div>

                {/* Editor Content */}
                <div className="flex flex-col flex-1 p-6 border rounded-xl bg-card min-h-[500px]">
                    <div className="mb-4">
                        <Label className={fieldErrors.prompt_preview ? "text-destructive" : ""}>
                            Prompt Content <span className="text-destructive">*</span>
                        </Label>
                    </div>
                    <div className="flex-1 min-h-[400px]">
                        <PromptEditor
                            value={formData.prompt_preview}
                            onChange={(val) => updateField("prompt_preview", val)}
                            error={fieldErrors.prompt_preview}
                        />
                    </div>
                </div>

                {/* Validation Result Panel */}
                {validationResult && (
                    <div id="validation-panel">
                        <ValidationResultPanel result={validationResult} />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t mt-auto">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 md:flex-none min-h-11 px-4"
                >
                    {isSubmitting ? (
                        <>
                            <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                            Publishing...
                        </>
                    ) : (
                        <>
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Validate & Publish
                        </>
                    )}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                    className="flex-1 md:flex-none min-h-11 px-4"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                </Button>
            </div>
        </form>
    );
}
