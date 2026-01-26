import type { TadaDocumentNode } from 'gql.tada';
import { print } from 'graphql';
import { getAuthToken } from '@/lib/auth';

const VENDURE_CHANNEL_TOKEN = process.env.VENDURE_CHANNEL_TOKEN || process.env.NEXT_PUBLIC_VENDURE_CHANNEL_TOKEN || '__default_channel__';
const VENDURE_AUTH_TOKEN_HEADER = process.env.VENDURE_AUTH_TOKEN_HEADER || 'vendure-auth-token';
const VENDURE_CHANNEL_TOKEN_HEADER = process.env.VENDURE_CHANNEL_TOKEN_HEADER || 'vendure-token';

/**
 * Get the Vendure API URL from environment variables
 * Returns null if not set (allows graceful handling during build)
 */
function getVendureApiUrl(): string | null {
    const url = process.env.VENDURE_SHOP_API_URL || process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL;
    return url || null;
}

interface VendureRequestOptions {
    token?: string;
    useAuthToken?: boolean;
    channelToken?: string;
    fetch?: RequestInit;
    tags?: string[];
}

interface VendureResponse<T> {
    data?: T;
    errors?: Array<{ message: string;[key: string]: unknown }>;
}

/**
 * Extract the Vendure auth token from response headers
 */
function extractAuthToken(headers: Headers): string | null {
    return headers.get(VENDURE_AUTH_TOKEN_HEADER);
}


/**
 * Execute a GraphQL query against the Vendure API
 */
export async function query<TResult, TVariables>(
    document: TadaDocumentNode<TResult, TVariables>,
    ...[variables, options]: TVariables extends Record<string, never>
        ? [variables?: TVariables, options?: VendureRequestOptions]
        : [variables: TVariables, options?: VendureRequestOptions]
): Promise<{ data: TResult; token?: string }> {
    const {
        token,
        useAuthToken,
        channelToken,
        fetch: fetchOptions,
        tags,
    } = options || {};

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions?.headers as Record<string, string>),
    };

    // Use the explicitly provided token, or fetch from cookies if useAuthToken is true
    let authToken = token;
    if (useAuthToken && !authToken) {
        authToken = await getAuthToken();
    }

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Set the channel token header (use provided channelToken or default)
    headers[VENDURE_CHANNEL_TOKEN_HEADER] = channelToken || VENDURE_CHANNEL_TOKEN;

    const vendureApiUrl = getVendureApiUrl();
    
    // Gracefully handle missing API URL (e.g., during build without env vars)
    if (!vendureApiUrl) {
        throw new Error('VENDURE_SHOP_API_URL or NEXT_PUBLIC_VENDURE_SHOP_API_URL environment variable is not set');
    }

    // Add timeout and proper fetch configuration
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
        const response = await fetch(vendureApiUrl, {
            ...fetchOptions,
            method: 'POST',
            headers,
            body: JSON.stringify({
                query: print(document),
                variables: variables || {},
            }),
            signal: controller.signal,
            ...(tags && { next: { tags } }),
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            // Try to get error details from response body
            let errorDetails = '';
            try {
                const errorBody = await response.text();
                errorDetails = errorBody;
                // Try to parse as JSON for better error message
                try {
                    const errorJson = JSON.parse(errorBody);
                    if (errorJson.errors && Array.isArray(errorJson.errors)) {
                        errorDetails = errorJson.errors.map((e: any) => e.message || JSON.stringify(e)).join(', ');
                    } else if (errorJson.message) {
                        errorDetails = errorJson.message;
                    }
                } catch {
                    // Not JSON, use text as-is
                }
            } catch {
                errorDetails = `HTTP ${response.status} ${response.statusText}`;
            }
            throw new Error(`HTTP error! status: ${response.status} - ${errorDetails}`);
        }

        const result: VendureResponse<TResult> = await response.json();

        if (result.errors) {
            throw new Error(result.errors.map(e => e.message).join(', '));
        }

        if (!result.data) {
            throw new Error('No data returned from Vendure API');
        }

        const newToken = extractAuthToken(response.headers);

        return {
            data: result.data,
            ...(newToken && { token: newToken }),
        };
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timeout: Vendure API did not respond within 30 seconds');
        }
        throw error;
    }
}

/**
 * Execute a GraphQL mutation against the Vendure API
 */
export async function mutate<TResult, TVariables>(
    document: TadaDocumentNode<TResult, TVariables>,
    ...[variables, options]: TVariables extends Record<string, never>
        ? [variables?: TVariables, options?: VendureRequestOptions]
        : [variables: TVariables, options?: VendureRequestOptions]
): Promise<{ data: TResult; token?: string }> {
    // Mutations use the same underlying implementation as queries in GraphQL
    // @ts-expect-error - Complex conditional type inference, runtime behavior is correct
    return query(document, variables, options);
}
