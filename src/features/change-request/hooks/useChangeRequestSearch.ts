import { useCallback, useMemo, useState } from 'react';
import { useFetch } from '@/shared/hooks';
import type { ChangeRequest } from '@/features/change-request/types/change-request';

interface UseChangeRequestSearchOptions {
    pageSize?: number;
    initialPage?: number;
    searchText?: string;
    enabled?: boolean;
}

export function useChangeRequestSearch({
    pageSize = 10,
    initialPage = 1,
    searchText = '',
    enabled = true,
}: UseChangeRequestSearchOptions) {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const { data, loading } = useFetch<any>({
        url: '/api/change_request/search',
        enabled,
        options: {
            method: 'POST',
            body: JSON.stringify({
                current_page: currentPage,
                page_size: pageSize,
                search_text: searchText,
            }),
        },
    });

    const logs: ChangeRequest[] = data?.records ?? [];
    const paginationInfo = data?.pagination;

    const onPrev = useCallback(
        () => setCurrentPage(p => Math.max(1, p - 1)),
        []
    );

    const onNext = useCallback(() => {
        const totalPages = paginationInfo?.number_of_pages ?? 1;
        setCurrentPage(p => Math.min(totalPages, p + 1));
    }, [paginationInfo]);

    return {
        logs,
        loading,
        currentPage,
        pageSize,
        paginationInfo,
        setCurrentPage,
        onPrev,
        onNext,
    };
}
