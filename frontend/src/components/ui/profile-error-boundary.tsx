"use client";

import React from "react";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ProfileErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("Profile Page Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="text-red-500 text-4xl mb-4">⚠</div>

                    <h2 className="text-2xl font-semibold mb-2">
                        Unable to load profile
                    </h2>

                    <p className="text-muted-foreground mb-6">
                        Something went wrong while loading the profile.
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 rounded-lg bg-primary text-primary-foreground"
                    >
                        Retry
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
