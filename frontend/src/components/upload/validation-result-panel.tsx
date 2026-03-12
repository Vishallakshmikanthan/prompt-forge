import { type FullValidationResult } from "@/lib/validation/prompt-validator";
import { CheckCircle, XCircle, AlertTriangle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationResultPanelProps {
    result: FullValidationResult;
}

function ScoreBar({ score, max = 25, label }: { score: number; max?: number; label: string }) {
    const pct = Math.round((score / max) * 100);
    const color = pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500";
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-24 shrink-0 capitalize">{label}</span>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-mono text-muted-foreground w-10 text-right">{score}/{max}</span>
        </div>
    );
}

export function ValidationResultPanel({ result }: ValidationResultPanelProps) {
    const { passed, injectionResult, maliciousResult, qualityScore } = result;
    const score = qualityScore.total;
    const scoreColor = score >= 80 ? "text-green-500" : score >= 60 ? "text-amber-500" : "text-red-500";
    const scoreBg = score >= 80 ? "bg-green-500/10 border-green-500/20" : score >= 60 ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20";

    return (
        <div className={cn("rounded-xl border p-5 space-y-5 transition-all", passed ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20")}>
            {/* Overall Status */}
            <div className="flex items-center gap-3">
                {passed ? (
                    <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                ) : (
                    <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                )}
                <div>
                    <p className="font-semibold text-sm">{passed ? "Validation Passed" : "Validation Failed"}</p>
                    <p className="text-xs text-muted-foreground">{passed ? "Your prompt is ready to publish." : "Please fix the issues below before publishing."}</p>
                </div>
            </div>

            {/* Security Checks */}
            {(!injectionResult.passed || !maliciousResult.passed) && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Security Issues</p>
                    {!injectionResult.passed && (
                        <div className="flex gap-2 items-start text-sm text-red-600 dark:text-red-400 bg-red-500/10 rounded-lg p-3">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{injectionResult.message}</span>
                        </div>
                    )}
                    {!maliciousResult.passed && (
                        <div className="flex gap-2 items-start text-sm text-red-600 dark:text-red-400 bg-red-500/10 rounded-lg p-3">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{maliciousResult.message}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Quality Score */}
            <div className={cn("rounded-lg border p-4 space-y-3", scoreBg)}>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5" /> Quality Score
                    </span>
                    <span className={cn("text-2xl font-extrabold font-mono", scoreColor)}>{score}<span className="text-sm font-normal text-muted-foreground">/100</span></span>
                </div>
                <div className="space-y-2">
                    {Object.entries(qualityScore.breakdown).map(([key, val]) => (
                        <ScoreBar key={key} label={key} score={val} max={25} />
                    ))}
                </div>
            </div>

            {/* Improvement Feedback */}
            {qualityScore.feedback.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suggestions</p>
                    <ul className="space-y-1.5">
                        {qualityScore.feedback.map((tip, i) => (
                            <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                                <span className="text-amber-500 shrink-0">→</span>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
