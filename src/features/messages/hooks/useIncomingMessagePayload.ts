'use client';

import { useState, useCallback } from 'react';
import { useFetch } from '@/shared/hooks';

interface PayloadResponse {
    response_body?: {
        response_payload?: {
            raw_data_json?: any;
            enriched_data_json?: any;
            transformed_data_json?: any;
        };
    };
}

export function useIncomingMessagePayload() {
    const [ingestId, setIngestId] = useState<string | null>(null);

    const rawFetch = useFetch<PayloadResponse>({
        url: '/api/incoming-message/get/raw',
        enabled: !!ingestId,
        options: {
            method: 'POST',
            body: JSON.stringify({
                request_body: {
                    pagination_request: { current_page: 1, page_size: 1 },
                    request_payload: { ingest_id: ingestId },
                },
            }),
        },
    });

    const transformedFetch = useFetch<PayloadResponse>({
        url: '/api/incoming-message/get/transformed',
        enabled: !!ingestId,
        options: {
            method: 'POST',
            body: JSON.stringify({
                request_body: {
                    pagination_request: { current_page: 1, page_size: 1 },
                    request_payload: { ingest_id: ingestId },
                },
            }),
        },
    });

    const fetchAll = useCallback((id: string) => {
        setIngestId(id);
    }, []);

    return {
        fetchAll,
        loading: rawFetch.loading || transformedFetch.loading,

        rawJson:
            rawFetch.data?.response_body?.response_payload?.raw_data_json ?? null,

        enrichedJson:
            transformedFetch.data?.response_body?.response_payload
                ?.enriched_data_json ?? null,

        transformedJson:
            transformedFetch.data?.response_body?.response_payload
                ?.transformed_data_json ?? null,
    };
}
