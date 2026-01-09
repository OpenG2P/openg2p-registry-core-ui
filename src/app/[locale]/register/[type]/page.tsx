'use client';

import { useMemo, useCallback, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/navigation';
import { TopBar } from '@/components/shared';
import { SelectedFilters } from '@/features/filter/components';
import { useRegistryFilters } from '@/features/filter/hooks/useRegistryFilters';
import { useFetch } from '@/shared/hooks/useFetch';
import { useRegister } from '@/context/RegisterContext';

interface DisplayField {
    field_name: string;
    value: string;
    order: number;
}

interface RegisterRecord {
    internal_record_id: string;
    functional_record_id: string;
    record_name: string;
    record_image_url: string | null;
    display_fields: DisplayField[];
}

interface PaginationInfo {
    number_of_pages: number;
    number_of_items: number;
}

interface RegisterRecordsApiResponse {
    records: RegisterRecord[];
    pagination: PaginationInfo;
}

interface PaginationState {
    page: number;
    limit: number;
    total: number;
    pageStart: number;
    pageEnd: number;
}

export default function RegisterTypePage() {
    const locale = useLocale();
    const router = useRouter();
    const t = useTranslations();
    const routeParams = useParams<{ type: string }>();
    const searchParams = useSearchParams();

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 7;

    const {
        appliedFilters,
        filterConfig,
        applyFilters,
        removeFilter,
        clearAllFilters,
    } = useRegistryFilters();

    const registerType = routeParams.type;
    const searchQuery = searchParams.get('search') || undefined;

    const { currentRegister } = useRegister();

    const registerId = currentRegister?.register_id;

    const registerTypeLabel = t(registerType) ?? currentRegister?.register_subject

    // whenever filter change same register type will be fetched
    const filterBy = useMemo(() => {
        if (!appliedFilters.length) return undefined;

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
        url: `/api/register/${registerType}`,
        enabled: !!registerId,
        options: {
            method: 'POST',
            body: JSON.stringify({
                current_page: currentPage,
                page_size: pageSize,
                sort_by:"",
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

        const pageStart =
            (currentPage - 1) * pageSize + 1;

        const pageEnd =
            Math.min(
                currentPage * pageSize,
                paginationInfo.number_of_items
            );

        return {
            pageStart,
            pageEnd,
            total: paginationInfo.number_of_items,
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


    const sortedDisplayFields = useCallback(
        (fields: DisplayField[]): DisplayField[] => {
            return [...fields].sort((a, b) => a.order - b.order);
        },
        []
    );

    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4]">
            <TopBar
                breadcrumb={[{ label: registerTypeLabel }]}
                showFilters
                showPagination
                pageStart={pagination.pageStart}
                pageEnd={pagination.pageEnd}
                total={pagination.total}
                onPrev={handlePreviousPage}
                onNext={handleNextPage}
                onApplyFilters={applyFilters}
                appliedFilters={appliedFilters}
                filterConfig={filterConfig}
            />

            <div className="mx-[30px] bg-white rounded-[30px]">
                <div className="px-2 pt-1">
                    <SelectedFilters
                        appliedFilters={appliedFilters}
                        filterConfig={filterConfig}
                        removeFilter={removeFilter}
                        clearAllFilters={clearAllFilters}
                        searchValue={searchQuery || ''}
                        searchPlaceholder={t('search')}
                        onSearch={handleSearch}
                    />
                </div>

                <div className="space-y-2">
                    {isLoadingRecords ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 p-4 w-full overflow-hidden bg-gray-200 animate-pulse"
                                >
                                    <div className="w-16 h-16 rounded-md bg-gray-300 shrink-0" />
                                    <div className="flex-1 space-y-2 min-w-0">
                                        <div className="h-4 bg-gray-300 rounded w-1/3" />
                                        <div className="h-3 bg-gray-300 rounded w-1/2" />
                                    </div>
                                    <div className="flex-1 space-y-2 min-w-0">
                                        <div className="h-3 bg-gray-300 rounded w-2/3" />
                                        <div className="h-3 bg-gray-300 rounded w-1/2" />
                                    </div>
                                    <div className="flex-1 space-y-2 min-w-0">
                                        <div className="h-3 bg-gray-300 rounded w-1/3" />
                                        <div className="h-3 bg-gray-300 rounded w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : records.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">{t('noItemsFound')}</div>
                    ) : (
                        records.map((record, index) => {
                            const sortedFields = sortedDisplayFields(record.display_fields);
                            const isEven = index % 2 === 0;

                            return (
                                <Link
                                    key={record.internal_record_id}
                                    href={`/register/${registerType}/${record.internal_record_id}`}
                                    className="block w-full"
                                >
                                    <div className={`flex items-center gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 p-4 w-full overflow-hidden ${isEven
                                        ? 'bg-[#D9D9D940]'
                                        : 'bg-white'
                                        }`}>
                                        {record.record_image_url ? (
                                            <img
                                                src={record.record_image_url}
                                                alt={record.record_name}
                                                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-md object-cover shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-300 rounded-md shrink-0" />
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-[#ED7C22] text-sm sm:text-base mb-0.5">
                                                {record.record_name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-600">
                                                <span className="font-bold">{t('id')} :</span>{' '}
                                                <span className="font-bold text-gray-900">
                                                    {record.internal_record_id}
                                                </span>
                                            </p>
                                        </div>

                                        {[0, 2, 4].map((startIndex) => {
                                            const firstField = sortedFields[startIndex];
                                            const secondField = sortedFields[startIndex + 1];

                                            if (!firstField) return null;

                                            return (
                                                <div key={startIndex} className="flex-1 min-w-0">
                                                    <p className="text-xs sm:text-sm text-gray-900 truncate">
                                                        <span className="font-bold text-gray-600">
                                                            {t(firstField.field_name)}:{' '}
                                                        </span>
                                                        <span className="font-bold">{firstField.value}</span>
                                                    </p>
                                                    {secondField && (
                                                        <p className="text-xs sm:text-sm text-gray-900 truncate">
                                                            <span className="font-bold text-gray-600">
                                                                {t(secondField.field_name)}:{' '}
                                                            </span>
                                                            <span className="font-bold">{secondField.value}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
