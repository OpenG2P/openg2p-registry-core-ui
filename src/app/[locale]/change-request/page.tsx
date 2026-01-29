'use client';

import { useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';

import { TopBar } from '@/components/shared';
import { ChangeLogList, ChangeLogSkeleton } from '@/features/change-request/components';
import { useChangeRequestSearch } from '@/features/change-request/hooks/useChangeRequestSearch';

export default function ChangeRequestPage() {
    const locale = useLocale();
    const router = useRouter();
    const t = useTranslations();

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || undefined;

    const {
        logs,
        loading,
        currentPage,
        pageSize,
        paginationInfo,
        onPrev,
        onNext,
    } = useChangeRequestSearch({
        pageSize: 7,
        searchText: searchQuery,
    });

    const pageStart =
        paginationInfo && paginationInfo.number_of_items > 0
            ? (currentPage - 1) * pageSize + 1
            : 0;

    const pageEnd =
        paginationInfo
            ? Math.min(currentPage * pageSize, paginationInfo.number_of_items)
            : 0;

    const total = paginationInfo?.number_of_items ?? 0;


    const handleSearch = useCallback((searchValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue.trim()) {
            params.set('search', searchValue.trim());
        } else {
            params.delete('search');
        }
        router.push(`/change-request?${params.toString()}`);
    }, [searchParams]);

    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4]">
            <TopBar
                breadcrumb={[{ label: 'Change Request' }]}
                showSearch
                searchValue={searchQuery || ''}
                searchPlaceholder={t('search')}
                onSearch={handleSearch}
                showFilters={false}
                showPagination
                pageStart={pageStart}
                pageEnd={pageEnd}
                total={total}
                onPrev={onPrev}
                onNext={onNext}
            />

            <div className="px-7.5">
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <ChangeLogSkeleton key={i} isSearchView />
                        ))}
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-sm text-gray-400 text-center py-6">
                        No change requests found
                    </div>
                ) : (
                    <ChangeLogList
                        logs={logs}
                        isSearchView
                        getDetailsUrl={log =>
                            `/${locale}/change-request/${log.change_request_id}`
                        }
                    />
                )}
            </div>
        </div>
    );
}
