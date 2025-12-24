'use client';

import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TopBar } from '@/components/shared';
import { SelectedFilters } from '@/features/filter/components';
import { useRegistryFilters } from '@/features/filter/hooks/useRegistryFilters';
import { usePagination, useFetch } from '@/shared/hooks';
import { ChangeLogList } from '@/features/change-request/components';
import { ChangeLog } from '@/features/change-request/types/change-log';

export default function ChangeRequestPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

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

  const { data, loading } = useFetch<any>({
    url: '/api/change_request/get/list',
    options: {
      method: 'POST',
      body: JSON.stringify({
        request_body: {
          pagination_request: {
            current_page: currentPage,
            page_size: pageSize,
            sort_by: '',
            filter_by: '',
            search_text: searchText
          },
          request_payload: {},
        },
      }),
    },
  });

  const logs: ChangeLog[] =
    data?.response_body?.response_payload?.change_requests ?? [];

  const paginationInfo =
    data?.response_body?.pagination_response;

  const pagination = usePagination({
    totalItems: paginationInfo?.number_of_items ?? 0,
    currentPage,
    pageSize,
    currentCount: logs.length,
  });

  const onPrev = useCallback(() => {
    setCurrentPage(p => Math.max(1, p - 1));
  }, []);

  const onNext = useCallback(() => {
    const totalPages = paginationInfo?.number_of_pages ?? 1;
    setCurrentPage(p => Math.min(totalPages, p + 1));
  }, [paginationInfo]);


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