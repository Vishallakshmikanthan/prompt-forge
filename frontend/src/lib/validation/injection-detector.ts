export interface InjectionDetectionResult {
    passed: boolean;
    detectedPatterns: string[];
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

    if (detected.length > 0) {
        return {
            passed: false,
            detectedPatterns: detected,
            message: `Prompt contains potential injection patterns: ${detected.map(p => `"${p}"`).join(", ")}.`
        };
    }

    return { passed: true, detectedPatterns: [] };
}
