"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global App Error:", error);
    }, [error]);

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center p-4">
            <div className="bg-destructive/10 text-destructive p-3 rounded-full mb-6">
                <AlertCircle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tight">Something went wrong</h2>
            <p className="text-muted-foreground text-center max-w-md mb-8">
                We encountered an unexpected error. Don't worry, your data is safe.
                Please try refreshing the page or try again later.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} className="gap-2">
                    <RefreshCcw className="w-4 h-4" />
                    Try Again
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                    Back to Home
                </Button>
            </div>
        </div>
    );
}
