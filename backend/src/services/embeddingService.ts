/**
 * Semantic Embedding Service
 * 
 * This service is responsible for generating vector representations (embeddings)
 * of text content. In a production environment, this would call an AI provider 
 * like OpenAI (text-embedding-3-small) or use a local model via Transformers.js.
 * 
 * For this integration, we implement a deterministic mock that generates 
 * valid 384-dimensional vectors based on the input text.
 */

export const generateEmbedding = async (text: string): Promise<number[]> => {
    // Standard embedding dimension for many small models (e.g., all-MiniLM-L6-v2)
    const DIMENSION = 384;

    // Normalize text: lowercase and remove extra whitespace
    const normalizedText = text.toLowerCase().trim();

    // Generate a deterministic seed from the text hash
    let hash = 0;
    for (let i = 0; i < normalizedText.length; i++) {
        const char = normalizedText.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    // Use the hash as a seed for a simple LCG (Linear Congruential Generator)
    // to generate a high-dimensional vector
    const vector: number[] = [];
    let seed = Math.abs(hash);

    for (let i = 0; i < DIMENSION; i++) {
        // Simple LCG parameters
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        // Map to [-1, 1] range
        vector.push((seed / 4294967296) * 2 - 1);
    }

    // Normalize the vector (L2 norm) to make cosine similarity simpler
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    const normalizedVector = vector.map(val => val / magnitude);

    return normalizedVector;
};

/**
 * Compute cosine similarity between two vectors.
 * Since our vectors are L2-normalized, cosine similarity is just the dot product.
 */
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
    if (vecA.length !== vecB.length) return 0;
    return vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
};
