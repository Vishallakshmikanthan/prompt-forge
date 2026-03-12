"use client";

import { useAuth } from "./auth-provider";
import { Button } from "@/components/ui/button";

export function LoginButton() {
    const { signInWithGoogle, isLoading } = useAuth();

    return (
        <Button
            variant="default"
            onClick={signInWithGoogle}
            disabled={isLoading}
            className="hidden sm:flex bg-accent hover:bg-accent/90 text-primary-foreground font-medium shadow-lg hover:shadow-accent/25 transition-all"
        >
            Sign In
        </Button>
    );
}
