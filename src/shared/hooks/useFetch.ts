import { useState, useCallback } from 'react';
import {
    BackendResponse
} from '@/shared/types';


// A reusable custom hook for making HTTP requests
// from Next.js Client --> Next.js server APIs
// it accepts both post and get request

export function useFetch<T = any>() {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const execute = useCallback(async (url: string, options?: RequestInit) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers
                }
            });
            const result = await res.json();
            if (!res.ok) {
                const errData = result.catch(() => ({}));
                throw new Error(errData.error || `Error ${res.status}`);
            }
            setData(result);
            return result;
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, error, loading, execute, reset };
}
