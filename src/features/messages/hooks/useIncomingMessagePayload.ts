'use client';

import { useState, useCallback } from 'react';
import { useFetch } from '@/shared/hooks';

type PayloadType = 'raw' | 'transformed';

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
    const [type, setType] = useState<PayloadType | null>(null);

    const { data, loading } = useFetch<PayloadResponse>({
        url:
            type === 'raw'
                ? '/api/incoming-message/get/raw'
                : '/api/incoming-message/get/transformed',
        enabled: !!ingestId && !!type,
        options: {
            method: 'POST',
            body: JSON.stringify({
                request_body: {
                    pagination_request: {
                        current_page: 1,
                        page_size: 1,
                    },
                    request_payload: {
                        ingest_id: ingestId,
                    },
                },
            }),
        },
    });

    const fetchRaw = useCallback((id: string) => {
        setType('raw');
        setIngestId(id);
    }, []);

    const fetchTransformed = useCallback((id: string) => {
        setType('transformed');
        setIngestId(id);
    }, []);

    return {
        fetchRaw,
        fetchTransformed,
        loading,
        rawJson: data?.response_body?.response_payload?.raw_data_json ?? null,
        enrichedJson: data?.response_body?.response_payload?.enriched_data_json ?? null,
        transformedJson:
            data?.response_body?.response_payload?.transformed_data_json ?? null,
    };
}
