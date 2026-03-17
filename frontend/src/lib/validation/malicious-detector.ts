export interface MaliciousDetectionResult {
    passed: boolean;
    hasErrors: boolean;
    detectedKeywords: string[];
    warnings: string[];
    message?: string;
}

const ERROR_KEYWORDS: string[] = [
    "phishing",
    "malware",
    "exploit",
    "bypass authentication",
    "hacking tutorial",
    "trojan",
    "ransomware",
    "steal credentials",
    "spyware",
    "rootkit",
    "privilege escalation",
];

const WARNING_KEYWORDS: string[] = [
    "sql injection",
    "cross site scripting",
    "ddos",
    "brute force password",
];

/**
 * Detects malicious keywords in the given text.
 * Returns a result object with status and matched keywords.
 */
export function detectMaliciousContent(text: string): MaliciousDetectionResult {
    const lowerText = text.toLowerCase();
    
    const errors = ERROR_KEYWORDS.filter(keyword =>
        lowerText.includes(keyword.toLowerCase())
    );

    const warnings = WARNING_KEYWORDS.filter(keyword =>
        lowerText.includes(keyword.toLowerCase())
    );

    const hasErrors = errors.length > 0;
    const hasWarnings = warnings.length > 0;
    const detectedKeywords = [...errors, ...warnings];

    let message = undefined;
    if (hasErrors) {
        message = `Prompt contains prohibited content related to: ${errors.map(k => `"${k}"`).join(", ")}.`;
    } else if (hasWarnings) {
        message = `Prompt may contain harmful instructions related to: ${warnings.map(k => `"${k}"`).join(", ")}. Proceed with caution.`;
    }

    return { 
        passed: !hasErrors && !hasWarnings, 
        hasErrors,
        detectedKeywords,
        warnings,
        message
    };
}
