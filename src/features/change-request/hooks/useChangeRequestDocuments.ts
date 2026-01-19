import { useFetch } from '@/shared/hooks';

export interface ChangeRequestDocument {
    document_label_id: string;
    document_label: string;
    document_store_id: string;
    document_url: string;
}

export function useChangeRequestDocuments(
    changeRequestId?: string,
    enabled = true
) {
    const { data, loading, error } = useFetch<{
        documents: ChangeRequestDocument[];
    }>({
        url: '/api/change_request/documents',
        enabled: enabled && !!changeRequestId,
        options: {
            method: 'POST',
            body: JSON.stringify({
                request_body: {
                    request_payload: {
                        change_request_id: changeRequestId,
                    },
                },
            }),
        },
    });

    return {
        documents: data?.documents ?? [],
        loading,
        error,
    };
}
