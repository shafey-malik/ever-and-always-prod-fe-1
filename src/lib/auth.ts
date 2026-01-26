const AUTH_TOKEN_COOKIE = process.env.VENDURE_AUTH_TOKEN_COOKIE || 'vendure-auth-token';

/**
 * Check if we're running on the server
 */
function isServer(): boolean {
    return typeof window === 'undefined';
}

/**
 * Get auth token from cookies (works in both server and client)
 */
export async function getAuthToken(): Promise<string | undefined> {
    if (isServer()) {
        // Server-side: use next/headers
        try {
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies();
            return cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
        } catch (error: any) {
            // During build/prerender, cookies() may not be available
            if (error?.digest === 'HANGING_PROMISE_REJECTION' || error?.message?.includes('cookies()')) {
                return undefined;
            }
            throw error;
        }
    } else {
        // Client-side: use document.cookie
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === AUTH_TOKEN_COOKIE) {
                return decodeURIComponent(value);
            }
        }
        return undefined;
    }
}

/**
 * Set auth token in cookies (works in both server and client)
 */
export async function setAuthToken(token: string): Promise<void> {
    if (isServer()) {
        // Server-side: use next/headers
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        cookieStore.set(AUTH_TOKEN_COOKIE, token);
    } else {
        // Client-side: use document.cookie
        document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
    }
}

/**
 * Remove auth token from cookies (works in both server and client)
 */
export async function removeAuthToken(): Promise<void> {
    if (isServer()) {
        // Server-side: use next/headers
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        cookieStore.delete(AUTH_TOKEN_COOKIE);
    } else {
        // Client-side: use document.cookie
        document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }
}
