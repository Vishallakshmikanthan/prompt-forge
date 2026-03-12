export interface MaliciousDetectionResult {
    passed: boolean;
    detectedKeywords: string[];
    message?: string;
}

const MALICIOUS_KEYWORDS: string[] = [
    "phishing",
    "malware",
    "exploit",
    "bypass authentication",
    "hacking tutorial",
    "sql injection",
    "cross site scripting",
    "ddos",
    "brute force password",
    "trojan",
    "ransomware",
    "steal credentials",
    "spyware",
    "rootkit",
    "privilege escalation",
];

/**
 * Detects malicious keywords in the given text.
 * Returns a result object with status and matched keywords.
 */
export function detectMaliciousContent(text: string): MaliciousDetectionResult {
    const lowerText = text.toLowerCase();
    const detected = MALICIOUS_KEYWORDS.filter(keyword =>
        lowerText.includes(keyword.toLowerCase())
    );

    if (detected.length > 0) {
        return {
            passed: false,
            detectedKeywords: detected,
            message: `Prompt may contain harmful instructions related to: ${detected.map(k => `"${k}"`).join(", ")}.`
        };
    }

    return { passed: true, detectedKeywords: [] };
}
