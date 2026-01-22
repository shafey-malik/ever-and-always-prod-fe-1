import {cookies} from 'next/headers';

const AUTH_TOKEN_COOKIE = process.env.VENDURE_AUTH_TOKEN_COOKIE || 'vendure-auth-token';

export async function setAuthToken(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_TOKEN_COOKIE, token);
}

export async function getAuthToken(): Promise<string | undefined> {
    try {
        const cookieStore = await cookies();
        return cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
    } catch (error: any) {
        // During build/prerender, cookies() may not be available
        // Return undefined to allow the route to be dynamic at runtime
        if (error?.digest === 'HANGING_PROMISE_REJECTION' || error?.message?.includes('cookies()')) {
            return undefined;
        }
        throw error;
    }
}

export async function removeAuthToken() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_TOKEN_COOKIE);
}
