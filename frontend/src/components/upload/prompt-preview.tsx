import { PromptCard } from "../prompts/prompt-card";
import { type Prompt } from "@/lib/services/promptService";
import { type PromptFormData } from "./prompt-form";

interface PromptPreviewProps {
    promptData: Partial<PromptFormData>;
}

export function PromptPreview({ promptData }: PromptPreviewProps) {
    // Generate a default mock object that satisfies the backend Prompt type
    const displayPrompt: Prompt = {
        id: "preview-id",
        title: promptData.title || "Untitled Prompt",
        description: promptData.description || "Add a description to see how it looks.",
        promptContent: promptData.prompt_preview || "Your prompt content will appear here...",
        category: promptData.category || "Uncategorized",
        aiModel: promptData.ai_model || "Any Model",
        tags: promptData.tags?.length ? promptData.tags : ["tag1", "tag2"],
        authorId: "preview-user",
        author: {
            id: "preview-user",
            username: "@current_user",
            email: "user@example.com"
        },
        score: 0,
        moderationStatus: "approved",
        createdAt: new Date().toISOString()
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="text-lg font-semibold">Live Preview</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Updates as you type</span>
            </div>

            <div className="relative pointer-events-none">
                {/* Disable pointer events to emphasize this is just a preview */}
                <PromptCard prompt={displayPrompt} />
            </div>

            <p className="text-sm text-muted-foreground mt-4 text-center">
                This is how your prompt will display on the platform.
            </p>
        </div>
    );
}
