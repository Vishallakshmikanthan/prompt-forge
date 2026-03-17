"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Copy, Check, Loader2, Square } from "lucide-react";
import { toast } from "sonner";

interface PromptPlaygroundProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    promptContent: string;
    promptTitle: string;
}

const MODELS = [
    { id: "gpt-4o", label: "GPT-4o" },
    { id: "claude-sonnet", label: "Claude Sonnet" },
    { id: "gemini-flash", label: "Gemini Flash" },
] as const;

function extractVariables(text: string): string[] {
    const regex = /\{(\w+)\}/g;
    const matches = [...text.matchAll(regex)];
    const unique = [...new Set(matches.map((m) => m[1]))];
    return unique;
}

export function PromptPlayground({
    open,
    onOpenChange,
    promptContent,
    promptTitle,
}: PromptPlaygroundProps) {
    const [variables, setVariables] = useState<Record<string, string>>({});
    const [model, setModel] = useState<string>("gpt-4o");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const outputRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    const detectedVars = useMemo(() => extractVariables(promptContent), [promptContent]);

    // Reset state when panel opens with new content
    useEffect(() => {
        if (open) {
            setOutput("");
            setLoading(false);
            setVariables({});
            setCopied(false);
        }
    }, [open, promptContent]);

    // Auto-scroll output
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    const handleVariableChange = useCallback((key: string, value: string) => {
        setVariables((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleStop = useCallback(() => {
        abortRef.current?.abort();
    }, []);

    const handleRun = async () => {
        setOutput("");
        setLoading(true);
        setCopied(false);

        const controller = new AbortController();
        abortRef.current = controller;

        const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '').replace(/\/api$/, '') || '';
        const url = `${apiBase}/api/playground/run`;

        try {
            const token = typeof window !== "undefined"
                ? document.cookie
                    .split("; ")
                    .find((c) => c.startsWith("token="))
                    ?.split("=")[1] || localStorage.getItem("token") || ""
                : "";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    promptText: promptContent,
                    model,
                    variables,
                }),
                signal: controller.signal,
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || `Request failed (${response.status})`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No response stream");

            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || !trimmed.startsWith("data: ")) continue;
                    const data = trimmed.slice(6);
                    if (data === "[DONE]") continue;

                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.error) {
                            toast.error(parsed.error);
                        } else if (parsed.token) {
                            setOutput((prev) => prev + parsed.token);
                        }
                    } catch {
                        // ignore malformed SSE
                    }
                }
            }
        } catch (err: any) {
            if (err.name === "AbortError") {
                // user stopped
            } else {
                toast.error(err.message || "Failed to run prompt");
            }
        } finally {
            setLoading(false);
            abortRef.current = null;
        }
    };

    const handleCopyOutput = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success("Output copied to clipboard");
        } catch {
            toast.error("Failed to copy output");
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-full sm:max-w-lg lg:max-w-xl flex flex-col overflow-hidden"
            >
                <SheetHeader className="shrink-0">
                    <SheetTitle className="truncate">Prompt Playground</SheetTitle>
                    <SheetDescription className="truncate">
                        Test &quot;{promptTitle}&quot; with different inputs
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 flex flex-col gap-4 overflow-y-auto mt-4 pr-1">
                    {/* Model Selector */}
                    <div className="space-y-2">
                        <Label htmlFor="model-select">Model</Label>
                        <select
                            id="model-select"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            {MODELS.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Variable Inputs */}
                    {detectedVars.length > 0 && (
                        <div className="space-y-3">
                            <Label>Variables</Label>
                            {detectedVars.map((v) => (
                                <div key={v} className="space-y-1">
                                    <label
                                        htmlFor={`var-${v}`}
                                        className="text-xs font-medium text-muted-foreground"
                                    >
                                        {`{${v}}`}
                                    </label>
                                    <Input
                                        id={`var-${v}`}
                                        placeholder={`Enter ${v}...`}
                                        value={variables[v] || ""}
                                        onChange={(e) => handleVariableChange(v, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Run / Stop Button */}
                    <div className="flex gap-2">
                        <Button
                            onClick={handleRun}
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Running...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 mr-2" />
                                    Run Prompt
                                </>
                            )}
                        </Button>
                        {loading && (
                            <Button variant="outline" size="icon" onClick={handleStop} title="Stop">
                                <Square className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {/* Output Console */}
                    <div className="flex-1 min-h-[200px] flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <Label>Output</Label>
                            {output && !loading && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopyOutput}
                                    className="h-7 px-2 text-xs"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-3 h-3 mr-1" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3 h-3 mr-1" />
                                            Copy Output
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                        <div
                            ref={outputRef}
                            className="flex-1 min-h-[180px] max-h-[400px] overflow-y-auto rounded-md border bg-muted/30 p-3 font-mono text-sm whitespace-pre-wrap break-words"
                        >
                            {output || (
                                <span className="text-muted-foreground italic">
                                    Output will appear here after running the prompt...
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
