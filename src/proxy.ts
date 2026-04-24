import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

// In-memory cache to store the default locale
let cachedDefaultLocale: string | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function fetchDefaultLocale() {
    const now = Date.now();
    if (cachedDefaultLocale && (now - lastFetchTime < CACHE_TTL)) {
        return cachedDefaultLocale;
    }

    try {
        const backendUrl = process.env.BACKEND_API_URL;
        if (!backendUrl) return routing.defaultLocale;

        const response = await fetch(`${backendUrl}/registry-language/get_default_registry_language`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        if (response.ok) {
            const data = await response.json();
            const code = data.response_body?.response_payload?.registry_default_lang_code;
            if (code) {
                cachedDefaultLocale = code;
                lastFetchTime = now;
                return cachedDefaultLocale;
            }
        }
    } catch (e) {
        console.error('Proxy: Failed to fetch registry default locale', e);
    }

    return cachedDefaultLocale || routing.defaultLocale;
}

export default async function middleware(request: NextRequest) {
    const dynamicDefaultLocale = await fetchDefaultLocale();
    const handleRequest = createMiddleware({
        ...routing,
        defaultLocale: dynamicDefaultLocale as any
    });

    return handleRequest(request);
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
