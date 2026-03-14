/**
 * Base API Configuration and generic fetch wrapper
 */

const isServer = typeof window === 'undefined';
let BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Ensure absolute URLs have the /api prefix since the backend routes are mounted there
if (BASE_URL.startsWith('http') && !BASE_URL.endsWith('/api')) {
    BASE_URL = `${BASE_URL.replace(/\/$/, '')}/api`;
}

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
    // Ensure endpoint starts with /
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // If we have a NEXT_PUBLIC_API_URL, we use it. 
    // Otherwise, we use relative paths which will work if proxied or on same domain.
    const url = BASE_URL ? `${BASE_URL}${cleanEndpoint}` : cleanEndpoint;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options?.headers || {}),
            },
        });

        // Handle cases where response might not be JSON
        let data: any;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = { message: await response.text() };
        }

        if (!response.ok) {
            throw new ApiError(
                response.status,
                data.message || `API Error: ${response.statusText}`
            );
        }

        // The Express backend wraps responses in `{ status: 'success', data: ... }`
        // but some internal APIs might return the data directly
        return (data.data !== undefined ? data.data : data) as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        console.error("API fetch failed:", error);

        throw new ApiError(
            500,
            error instanceof Error ? error.message : "Network error occurred"
        );
    }
}
