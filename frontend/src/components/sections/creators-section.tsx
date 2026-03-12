import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const creators = [
    { id: "1", name: "Sarah Dev", handle: "@sarah.dev", role: "Full Stack Engineer" },
    { id: "2", name: "Alex PromptMaster", handle: "@alexprompt", role: "AI Researcher" },
    { id: "3", name: "Data Ninja", handle: "@data_ninja", role: "Data Scientist" },
    { id: "4", name: "UI Weaver", handle: "@ui.weaver", role: "Design Systems Lead" },
];

export function CreatorsSection() {
    return (
        <section className="py-24 bg-muted/10 border-t">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-4">Top Creators</h2>
                <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
                    Learn from the best prompt engineers pushing the boundaries of AI-assisted development.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                    {creators.map((creator) => (
                        <div key={creator.id} className="flex flex-col items-center p-6 border rounded-2xl bg-background shadow-sm hover:shadow-md transition-shadow">
                            <Avatar className="w-20 h-20 mb-4 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.handle}`} alt={creator.name} />
                                <AvatarFallback>{creator.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-semibold text-lg">{creator.name}</h3>
                            <p className="text-sm text-primary mb-1">{creator.handle}</p>
                            <p className="text-xs text-muted-foreground mb-4">{creator.role}</p>
                            <Button variant="outline" size="sm" className="w-full rounded-full">Follow</Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
