import { useCallback, useMemo, useState } from 'react';
import { useFetch } from '@/shared/hooks';

interface OutgoingMessage {
    outgest_id: string;
    queued_datetime: string;
    source_register: string;
    record_id: string;
    source_change_log_id: string;
    topic_resolution: string;
    topic_resolution_datetime: string;
    number_of_topics_resolved: number;
    topic_names: string[];
}

interface UseOutgoingMessagesListOptions {
    pageSize?: number;
    initialPage?: number;
    searchText?: string;
    enabled?: boolean;
}

export function useOutgoingMessagesList({
    pageSize = 10,
    initialPage = 1,
    searchText = '',
    enabled = true,
}: UseOutgoingMessagesListOptions) {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const requestBody = useMemo(
        () => ({
            request_body: {
                pagination_request: {
                    current_page: currentPage,
                    page_size: pageSize,
                    sort_by: '',
                    filter_by: '',
                    search_text: searchText,
                },
                request_payload: {
                    // Add payload specifics if any
                },
            },
        }),
        [currentPage, pageSize, searchText]
    );

    const { data, loading } = useFetch<{
        response_body?: {
            response_payload?: { outgoing_messages?: OutgoingMessage[] };
            pagination_response?: { number_of_items: number; number_of_pages: number };
        };
    }>({
        url: '/api/outgoing-message/get/list',
        enabled,
        options: {
            method: 'POST',
            body: JSON.stringify(requestBody),
        },
    });

    const messages: OutgoingMessage[] =
        data?.response_body?.response_payload?.outgoing_messages ?? [];

    const paginationInfo = data?.response_body?.pagination_response;

    const onPrev = useCallback(() => setCurrentPage(p => Math.max(1, p - 1)), []);

    const onNext = useCallback(() => {
        const totalPages = paginationInfo?.number_of_pages ?? 1;
        setCurrentPage(p => Math.min(totalPages, p + 1));
    }, [paginationInfo]);

    return {
        messages,
        loading,
        currentPage,
        pageSize,
        paginationInfo,
        setCurrentPage,
        onPrev,
        onNext,
    };
}
