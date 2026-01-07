'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { TopBar } from '@/components/shared';
import { SelectedFilters } from '@/features/filter/components';
import { useRegistryFilters } from '@/features/filter/hooks/useRegistryFilters';
import { usePagination } from '@/shared/hooks';
import { ChangeLogList } from '@/features/change-request/components';
import { useChangeRequestList } from '@/features/change-request/hooks/useChangeRequestList';

export default function ChangeRequestPage() {
    const searchParams = useSearchParams();
    const searchText = useMemo(
        () => searchParams.get('q') ?? '',
        [searchParams]
    );

    const {
        appliedFilters,
        filterConfig,
        applyFilters,
        removeFilter,
        clearAllFilters,
    } = useRegistryFilters();

    const {
        logs,
        loading,
        currentPage,
        pageSize,
        paginationInfo,
        onPrev,
        onNext,
    } = useChangeRequestList({
        pageSize: 7,
        searchText,
    });

    const pagination = usePagination({
        totalItems: paginationInfo?.number_of_items ?? 0,
        currentPage,
        pageSize,
        currentCount: logs.length,
    });

    if (loading) {
        return (
            <div className="bg-white rounded-lg border p-4 text-sm">
                Loading change requests...
            </div>
        );
    }

    return (
        <div className="min-h-screen mx-auto">
            <TopBar
                breadcrumb={[{ label: 'Change Request' }]}
                showFilters
                showPagination
                pageStart={pagination.pageStart}
                pageEnd={pagination.pageEnd}
                total={pagination.total}
                onPrev={onPrev}
                onNext={onNext}
                onApplyFilters={applyFilters}
                appliedFilters={appliedFilters}
                filterConfig={filterConfig}
            />

            <div className="px-6 py-4">
                <SelectedFilters
                    appliedFilters={appliedFilters}
                    filterConfig={filterConfig}
                    removeFilter={removeFilter}
                    clearAllFilters={clearAllFilters}
                />
            </div>

            <div className="px-6">
                {logs.length === 0 ? (
                    <div className="text-sm text-gray-400 text-center py-6">
                        No change requests found
                    </div>
                ) : (
                    <ChangeLogList
                        logs={logs}
                        getDetailsUrl={log =>
                            `/change-request/${log.change_request_id}`
                        }
                    />
                )}
            </div>
        </div>
    );
}