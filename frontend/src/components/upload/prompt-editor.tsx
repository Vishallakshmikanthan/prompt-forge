"use client";

import { Textarea } from "@/components/ui/textarea";

interface PromptEditorProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export function PromptEditor({ value, onChange, error }: PromptEditorProps) {
    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <div className={`relative rounded-md border bg-muted/30 p-1 flex-1 min-h-[400px] flex flex-col transition-colors ${error ? 'border-destructive ring-1 ring-destructive' : 'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'}`}>
                {/* Editor Toolbar (Mock styling) */}
                <div className="flex items-center px-4 py-2 border-b bg-muted/50 rounded-t-sm mb-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                    </div>
                    <span className="ml-4 text-xs font-mono text-muted-foreground">prompt-content.txt</span>
                </div>

                {/* Textarea */}
                <Textarea
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
                    placeholder="Write your prompt logic here... Consider using {{variables}} to suggest where users should insert their own context."
                    className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent font-mono text-sm leading-relaxed text-foreground p-4 h-full min-h-[350px]"
                />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>Markdown supported</span>
                <span>{value.length} characters</span>
            </div>
        </div>
    );
}
