export function DeveloperGrid() {
    return (
        <div className="pointer-events-none fixed inset-0 flex justify-center z-[100] mix-blend-overlay opacity-[0.03] dark:opacity-[0.05]">
            <div className="h-full w-full max-w-[1280px] grid grid-cols-4 md:grid-cols-12 gap-4 px-4 md:px-8">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-full border-x border-foreground/20 ${i >= 4 ? "hidden md:block" : ""
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
