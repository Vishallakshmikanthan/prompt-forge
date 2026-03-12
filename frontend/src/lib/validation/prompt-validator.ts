import { detectInjection, type InjectionDetectionResult } from "./injection-detector";
import { detectMaliciousContent, type MaliciousDetectionResult } from "./malicious-detector";
import { scorePromptQuality, type QualityScore } from "./quality-scoring";

export interface StructureValidationResult {
    passed: boolean;
    errors: Partial<Record<"title" | "description" | "prompt_preview" | "category" | "ai_model", string>>;
}

export interface FullValidationResult {
    passed: boolean;
    structureResult: StructureValidationResult;
    injectionResult: InjectionDetectionResult;
    maliciousResult: MaliciousDetectionResult;
    qualityScore: QualityScore;
}

export interface PromptValidationInput {
    title: string;
    description: string;
    prompt_preview: string;
    category: string;
    ai_model: string;
    tags: string[];
}

const MIN_SCORE = 60;

/**
 * Step 1: Validates structural requirements of the prompt form.
 */
function validateStructure(input: PromptValidationInput): StructureValidationResult {
    const errors: StructureValidationResult["errors"] = {};

    if (input.title.trim().length < 5)
        errors.title = "Title must be at least 5 characters long.";
    if (input.description.trim().length < 20)
        errors.description = "Description must be at least 20 characters to provide good context.";
    if (input.prompt_preview.trim().length < 50)
        errors.prompt_preview = "Prompt content must be at least 50 characters long.";
    if (!input.category)
        errors.category = "Please select a category.";
    if (!input.ai_model)
        errors.ai_model = "Please select a target AI model.";

    return { passed: Object.keys(errors).length === 0, errors };
}

/**
 * Runs the full 4-step validation pipeline on a single prompt submission.
 */
export function runFullValidation(input: PromptValidationInput): FullValidationResult {
    const textToScan = `${input.title} ${input.description} ${input.prompt_preview}`;

    const structureResult = validateStructure(input);
    const injectionResult = detectInjection(textToScan);
    const maliciousResult = detectMaliciousContent(textToScan);
    const qualityScore = scorePromptQuality(
        input.title,
        input.description,
        input.prompt_preview,
        input.tags
    );

    const passed =
        structureResult.passed &&
        injectionResult.passed &&
        maliciousResult.passed &&
        qualityScore.total >= MIN_SCORE;

    return { passed, structureResult, injectionResult, maliciousResult, qualityScore };
}
