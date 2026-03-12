"use client";

import { useAuth } from "./auth-provider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    const { signOut, isLoading } = useAuth();

    return (
        <Button
            variant="ghost"
            onClick={signOut}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
            size="sm"
        >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
        </Button>
    );
}
