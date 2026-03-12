export interface QualityScore {
    total: number;
    breakdown: {
        clarity: number;
        specificity: number;
        structure: number;
        reusability: number;
    };
    feedback: string[];
}

/**
 * Scores a prompt on clarity, specificity, structure, and reusability.
 * Each category is scored 0-25, total 0-100.
 * Minimum passing score: 60.
 */
export function scorePromptQuality(
    title: string,
    description: string,
    content: string,
    tags: string[]
): QualityScore {
    const feedback: string[] = [];

    // --- CLARITY (0-25) ---
    // Based on: sentence variety, avoiding vague words, decent description length
    let clarity = 0;
    const vagueWords = ["stuff", "things", "etc", "something", "anything"];
    const hasVague = vagueWords.some(w => content.toLowerCase().includes(w));
    if (!hasVague) clarity += 8;
    if (description.length >= 50) clarity += 8; else feedback.push("Add a more detailed description for better clarity.");
    if (title.length >= 10) clarity += 9; else feedback.push("A longer, more descriptive title improves clarity.");

    // --- SPECIFICITY (0-25) ---
    // Based on: use of {{variables}}, numbered steps, specific nouns
    let specificity = 0;
    const hasVariables = /\{\{.*?\}\}/.test(content);
    const hasNumberedSteps = /^\s*[0-9]+[\.\)]/m.test(content);
    const wordCount = content.trim().split(/\s+/).length;
    if (hasVariables) { specificity += 10; } else { feedback.push("Use {{variable}} placeholders for dynamic inputs."); }
    if (hasNumberedSteps) specificity += 7;
    if (wordCount >= 30) specificity += 8; else feedback.push("Provide more detailed prompt content.");

    // --- STRUCTURE (0-25) ---
    // Based on: line breaks, paragraphs, capitalization, punctuation
    let structure = 0;
    const hasLineBreaks = content.includes("\n");
    const endsWithPunctuation = /[.!?]$/.test(content.trim());
    const hasSections = content.split("\n\n").length > 1;
    if (hasLineBreaks) structure += 8;
    if (endsWithPunctuation) structure += 7;
    if (hasSections) structure += 10; else feedback.push("Organize your prompt into clear sections.");

    // --- REUSABILITY (0-25) ---
    // Based on: tags provided, variables used, lack of hard-coded specifics
    let reusability = 0;
    const hasEnoughTags = tags.length >= 2;
    const hasHardCodedNames = /\b(John|Jane|Acme|Example Inc)\b/i.test(content);
    if (hasEnoughTags) reusability += 10; else feedback.push("Add at least 2 tags for better discoverability.");
    if (hasVariables) reusability += 10;
    if (!hasHardCodedNames) reusability += 5;

    const total = clarity + specificity + structure + reusability;

    if (total < 60) {
        feedback.push(`Quality score is ${total}/100. Minimum required is 60.`);
    }

    return {
        total,
        breakdown: { clarity, specificity, structure, reusability },
        feedback
    };
}
