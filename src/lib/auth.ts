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
 * Set auth token in cookies (server-only — cookie is httpOnly).
 */
export async function setAuthToken(token: string): Promise<void> {
    if (!isServer()) {
        throw new Error('setAuthToken must be called from a server action or route handler');
    }
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.set(AUTH_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
    });
}

/**
 * Remove auth token from cookies (server-only).
 */
export async function removeAuthToken(): Promise<void> {
    if (!isServer()) {
        throw new Error('removeAuthToken must be called from a server action or route handler');
    }
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.set(AUTH_TOKEN_COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
}
