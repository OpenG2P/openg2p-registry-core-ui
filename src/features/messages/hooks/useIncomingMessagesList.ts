import { useCallback, useMemo, useState } from 'react';
import { useFetch } from '@/shared/hooks';
import { IncomingMessage } from '@/features/messages/types';

interface UseIncomingMessagesListOptions {
    pageSize?: number;
    initialPage?: number;
    searchText?: string;
    subjectRecordId?: string;
    subjectRegisterId?: string;
    tabId?: string;
    enabled?: boolean;
}

interface IncomingMessagesApiResponse {
    response_body?: {
        pagination_response?: {
            number_of_items: number;
            number_of_pages: number;
        };
        response_payload?: IncomingMessage[];
    };
}

export function useIncomingMessagesList({
    pageSize = 7,
    initialPage = 1,
    searchText = '',
    subjectRecordId,
    subjectRegisterId,
    tabId,
    enabled = true,
}: UseIncomingMessagesListOptions) {
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
                    subject_register_id: subjectRegisterId,
                    subject_record_id: subjectRecordId,
                    tab_id: tabId,
                },
            },
        }),
        [currentPage, pageSize, searchText, subjectRegisterId, subjectRecordId, tabId]
    );

    const { data, loading } = useFetch<IncomingMessagesApiResponse>({
        url: '/api/incoming-message/get/list',
        enabled,
        options: {
            method: 'POST',
            body: JSON.stringify(requestBody),
        },
    });

    const messages: IncomingMessage[] =
        data?.response_body?.response_payload ?? [];

    const paginationInfo = data?.response_body?.pagination_response;

    const onPrev = useCallback(() => {
        setCurrentPage(p => Math.max(1, p - 1));
    }, []);

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
