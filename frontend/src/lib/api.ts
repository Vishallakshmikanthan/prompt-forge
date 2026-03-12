/**
 * Base API Configuration and generic fetch wrapper
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "ApiError";
    }
}

/**
 * Generic fetch wrapper that handles JSON parsing and standard error throwing.
 */
export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(
                response.status,
                data.message || `API Error: ${response.statusText}`
            );
        }

        // The Express backend wraps responses in `{ status: 'success', data: ... }`
        return data.data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        // Transform network/fetch errors into standard ApiErrors
        throw new ApiError(500, error instanceof Error ? error.message : "Network error occurred");
    }
}
