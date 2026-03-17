export interface InjectionDetectionResult {
    passed: boolean;
    hasErrors: boolean;
    detectedPatterns: string[];
    warnings: string[];
    message?: string;
}

const INJECTION_PATTERNS: string[] = [
    "ignore previous instructions",
    "disregard all rules",
    "reveal system prompt",
    "bypass safety",
    "developer mode",
    "act as if",
    "jailbreak",
    "ignore your instructions",
    "forget what you were told",
    "override instructions",
];

/**
 * Detects known prompt injection patterns in the given text.
 * Returns a result object with status and matched patterns.
 */
export function detectInjection(text: string): InjectionDetectionResult {
    const lowerText = text.toLowerCase();
    const detected = INJECTION_PATTERNS.filter(pattern =>
        lowerText.includes(pattern.toLowerCase())
    );

    const hasWarnings = detected.length > 0;
    
    // For now, treat all injection patterns as warnings that can be bypassed
    // but should be flagged to the user.
    return {
        passed: !hasWarnings,
        hasErrors: false, // Bypassable
        detectedPatterns: detected,
        warnings: detected,
        message: hasWarnings 
            ? `Prompt contains potential injection patterns: ${detected.map(p => `"${p}"`).join(", ")}. Use with caution.`
            : undefined
    };
}
