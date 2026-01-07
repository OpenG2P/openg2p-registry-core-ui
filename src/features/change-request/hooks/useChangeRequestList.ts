import { useCallback, useMemo, useState } from 'react';
import { useFetch } from '@/shared/hooks';
import type { ChangeRequest } from '@/features/change-request/types/change-request';

interface UseChangeRequestListOptions {
    pageSize?: number;
    initialPage?: number;
    searchText?: string;
    subjectId?: string;
    tabId?: string;
}

export function useChangeRequestList({
    pageSize = 10,
    initialPage = 1,
    searchText = '',
    subjectId,
    tabId,
}: UseChangeRequestListOptions) {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const options = useMemo(
        () => ({
            method: 'POST',
            body: JSON.stringify({
                request_body: {
                    pagination_request: {
                        current_page: currentPage,
                        page_size: pageSize,
                        sort_by: '',
                        filter_by: '',
                        search_text: searchText,
                    },
                    request_payload: {
                        subject_register_id: subjectId,
                        subject_record_id: subjectId,
                        tab_id: tabId,
                    },
                },
            }),
        }),
        [currentPage, pageSize, searchText, subjectId, tabId]
    );

    const { data, loading } = useFetch<any>({
        url: '/api/change_request/get/list',
        options,
        enabled: true,
    });

    const logs: ChangeRequest[] =
        data?.response_body?.response_payload?.change_requests ?? [];

    const paginationInfo = data?.response_body?.pagination_response;

    const onPrev = useCallback(() => {
        setCurrentPage((p) => Math.max(1, p - 1));
    }, []);

    const onNext = useCallback(() => {
        const totalPages = paginationInfo?.number_of_pages ?? 1;
        setCurrentPage((p) => Math.min(totalPages, p + 1));
    }, [paginationInfo]);

    return {
        logs,
        loading,
        currentPage,
        pageSize,
        paginationInfo,
        onPrev,
        onNext,
        setCurrentPage,
    };
}
