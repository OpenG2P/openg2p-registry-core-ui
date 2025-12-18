import { useState, useCallback, useRef, useEffect } from 'react';

interface UseFetchConfig {
  url?: string | null;
  options?: RequestInit;
  deps?: any[];
  enabled?: boolean;
}

export function useFetch<T = any>(config: UseFetchConfig = {}) {
  const { url = null, options, deps = [], enabled = true } = config;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const controllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!url || !enabled) return;

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          signal: controller.signal,
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result?.error || `Error ${res.status}`);
        }

        setData(result);
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;

        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        if (controllerRef.current === controller) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  return { data, error, loading, reset };
}
