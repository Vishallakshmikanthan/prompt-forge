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
    const { passed, isBlocked, injectionResult, maliciousResult, qualityScore, securityWarnings } = result;
    const score = qualityScore.total;
    const scoreColor = score >= 80 ? "text-green-500" : score >= 60 ? "text-amber-500" : "text-red-500";
    const scoreBg = score >= 80 ? "bg-green-500/10 border-green-500/20" : score >= 60 ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20";

    const hasWarningsOnly = !passed && !isBlocked && securityWarnings.length > 0;
    const statusColor = isBlocked ? "text-red-500" : hasWarningsOnly ? "text-amber-500" : "text-green-500";
    const statusBg = isBlocked ? "bg-red-500/5 border-red-500/20" : hasWarningsOnly ? "bg-amber-500/5 border-amber-500/20" : "bg-green-500/5 border-green-500/20";
    const StatusIcon = isBlocked ? XCircle : hasWarningsOnly ? AlertTriangle : CheckCircle;

    return (
        <div className={cn("rounded-xl border p-5 space-y-5 transition-all", statusBg)}>
            {/* Overall Status */}
            <div className="flex items-center gap-3">
                <StatusIcon className={cn("w-6 h-6 shrink-0", statusColor)} />
                <div>
                    <p className="font-semibold text-sm">
                        {isBlocked ? "Validation Failed" : hasWarningsOnly ? "Validation Warning" : "Validation Passed"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {isBlocked ? "Please fix the blocking issues below before publishing." : 
                         hasWarningsOnly ? "Your prompt has security warnings but can be published. Review carefully." : 
                         "Your prompt is ready to publish."}
                    </p>
                </div>
            </div>

            {/* Security Checks */}
            {(securityWarnings.length > 0 || !injectionResult.passed || !maliciousResult.passed) && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Security Review</p>
                    {!injectionResult.passed && (
                        <div className={cn(
                            "flex gap-2 items-start text-sm rounded-lg p-3",
                            injectionResult.hasErrors ? "text-red-600 dark:text-red-400 bg-red-500/10" : "text-amber-600 dark:text-amber-400 bg-amber-500/10"
                        )}>
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{injectionResult.message}</span>
                        </div>
                    )}
                    {!maliciousResult.passed && (
                        <div className={cn(
                            "flex gap-2 items-start text-sm rounded-lg p-3",
                            maliciousResult.hasErrors ? "text-red-600 dark:text-red-400 bg-red-500/10" : "text-amber-600 dark:text-amber-400 bg-amber-500/10"
                        )}>
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
