/**
 * AI-based prompt moderation and quality analysis service.
 */

interface ModerationResult {
    isSafe: boolean;
    flaggedReason?: string;
}

interface QualityResult {
    score: number;
    metrics: {
        clarity: number;
        structure: number;
        specificity: number;
        usefulness: number;
    };
}

const INJECTION_PATTERNS = [
    /ignore previous instructions/i,
    /reveal system prompt/i,
    /bypass safety rules/i,
    /you are now an ai that/i,
];

const MALICIOUS_KEYWORDS = [
    'phishing',
    'exploit',
    'malware',
    'hack',
    'password',
    'credit card',
];

/**
 * Analyzes prompt content for potential injection or malicious patterns.
 */
export const analyzePromptContent = async (content: string): Promise<ModerationResult> => {
    const lowercaseContent = content.toLowerCase();

    // Check for injection patterns
    for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(lowercaseContent)) {
            return { isSafe: false, flaggedReason: `Potential prompt injection detected: ${pattern.toString()}` };
        }
    }

    // Check for malicious keywords
    for (const keyword of MALICIOUS_KEYWORDS) {
        if (lowercaseContent.includes(keyword)) {
            return { isSafe: false, flaggedReason: `Malicious keyword detected: ${keyword}` };
        }
    }

    return { isSafe: true };
};

/**
 * Calculates a quality score (0-100) based on text heuristics.
 * In a production app, this would use an LLM for deeper analysis.
 */
export const calculateQualityScore = async (content: string): Promise<QualityResult> => {
    // Basic heuristics for demo purposes
    const length = content.length;
    const wordCount = content.split(/\s+/).length;
    const hasStructure = /[\n#\-*]/.test(content); // Checks for new lines, headings, or lists

    // Metric 1: Clarity (based on average word length and readability)
    const clarity = Math.min(100, Math.max(0, 100 - Math.abs(wordCount - 50)));

    // Metric 2: Structure (based on presence of formatting)
    const structure = hasStructure ? 90 : 30;

    // Metric 3: Specificity (based on character length)
    const specificity = Math.min(100, (length / 500) * 100);

    // Metric 4: Usefulness (hybrid of length and formatting)
    const usefulness = (specificity * 0.6) + (structure * 0.4);

    const score = Math.round((clarity + structure + specificity + usefulness) / 4);

    return {
        score,
        metrics: {
            clarity: Math.round(clarity),
            structure: Math.round(structure),
            specificity: Math.round(specificity),
            usefulness: Math.round(usefulness),
        },
    };
};
