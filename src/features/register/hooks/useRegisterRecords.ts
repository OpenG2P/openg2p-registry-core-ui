
import { useState, useMemo, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useRegistryFilters } from '@/features/filter/hooks/useRegistryFilters';
import { useFetch } from '@/shared/hooks/useFetch';
import { useRegister } from '@/context/RegisterContext';
import { RegisterRecordsApiResponse } from '@/features/register/types';

export const useRegisterRecords = () => {
    const t = useTranslations();
    const router = useRouter();
    const routeParams = useParams<{ type: string }>();
    const searchParams = useSearchParams();

    const [currentPage, setCurrentPage] = useState(1);
    //TODO:Need to move in .env
    const pageSize = 10;

    const {
        appliedFilters,
        filterConfig,
        applyFilters,
        removeFilter,
        clearAllFilters,
    } = useRegistryFilters();

    const registerType = routeParams.type;
    const searchQuery = searchParams.get('search') || "";

    const { currentRegister } = useRegister();

    const registerId = currentRegister?.register_id;
    const registerTypeLabel = t(registerType) ?? currentRegister?.register_subject;

    const filterBy = useMemo(() => {
        if (!appliedFilters.length) return "";

        const stableFilters = [...appliedFilters].sort((a, b) => {
            const aKey = `${a.field_name}__${a.operator}`;
            const bKey = `${b.field_name}__${b.operator}`;
            return aKey.localeCompare(bKey);
        });

        const result: Record<string, Record<string, unknown>> = {};

        for (const rule of stableFilters) {
            const field = rule.field_name;
            const operator = rule.operator;
            const value = rule.value;

            if (!result[field]) result[field] = {};
            result[field][operator] = value;
        }

        return result;
    }, [appliedFilters]);

    const { data: recordsData, loading: isLoadingRecords } = useFetch<RegisterRecordsApiResponse>({
        url: `/api/register/records`,
        enabled: !!registerId,
        options: {
            method: 'POST',
            body: JSON.stringify({
                current_page: currentPage,
                page_size: pageSize,
                sort_by: "",
                filter_by: filterBy,
                search_text: searchQuery,
                register_id: currentRegister?.register_id,
            }),
        },
    });

    const records = recordsData?.records ?? [];
    const paginationInfo = recordsData?.pagination;

    const pagination = useMemo(() => {
        if (!paginationInfo) {
            return {
                pageStart: 0,
                pageEnd: 0,
                total: 0,
            };
        }

        const pageStart = (currentPage - 1) * pageSize + 1;
        const pageEnd = Math.min(
            currentPage * pageSize,
            // Handle case where API might return number_of_items as total?
            // PaginationResponse has number_of_items.
            paginationInfo.number_of_items || 0
        );

        return {
            pageStart,
            pageEnd,
            total: paginationInfo.number_of_items || 0,
        };
    }, [paginationInfo, currentPage, pageSize]);

    const handlePreviousPage = useCallback(() => {
        setCurrentPage(p => Math.max(1, p - 1));
    }, []);

    const handleNextPage = useCallback(() => {
        const totalPages = paginationInfo?.number_of_pages ?? 1;
        setCurrentPage(p => Math.min(totalPages, p + 1));
    }, [paginationInfo]);

    const handleSearch = useCallback((searchValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue.trim()) {
            params.set('search', searchValue.trim());
        } else {
            params.delete('search');
        }
        router.push(`/register/${registerType}?${params.toString()}`);
    }, [searchParams, router, registerType]);

    return {
        registerType,
        registerTypeLabel,
        records,
        isLoadingRecords,
        searchQuery,
        pagination,
        handlers: {
            handlePreviousPage,
            handleNextPage,
            handleSearch,
        },
        filters: {
            appliedFilters,
            filterConfig,
            applyFilters,
            removeFilter,
            clearAllFilters,
        }
    };
};
