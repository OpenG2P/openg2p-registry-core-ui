'use client';

import { useMemo, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TopBar } from '@/components/shared';
import { SelectedFilters } from '@/features/filter/components';
import { useRegistryFilters } from '@/features/filter/hooks/useRegistryFilters';
import { useFetch } from '@/shared/hooks/useFetch';

interface Register {
  register_id: string;
  register_mnemonic: string;
  register_subject: string;
  register_description: string;
  master_register_id: string | null;
}

interface DisplayField {
  field_name: string;
  value: string;
  order: number;
}

interface RegisterRecord {
  internal_record_id: string;
  functional_record_id: string;
  record_name: string;
  image: string | null;
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
  const router = useRouter();
  const routeParams = useParams<{ type: string }>();
  const searchParams = useSearchParams();

  const {
    appliedFilters,
    filterConfig,
    applyFilters,
    removeFilter,
    clearAllFilters,
  } = useRegistryFilters();

  const registerType = routeParams.type;
  const searchQuery = searchParams.get('search') || undefined;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('limit') || '7', 10);

  const { data: registersData } = useFetch<Register[]>({
    url: '/api/register/all',
  });

  const currentRegister = useMemo(
    () => registersData?.find(
      (register) => register.register_mnemonic.toLowerCase() === registerType.toLowerCase()
    ),
    [registersData, registerType]
  );

  const registerTypeLabel = currentRegister?.register_subject ?? 'Register';

  const { data: recordsData, loading: isLoadingRecords } = useFetch<RegisterRecordsApiResponse>({
    url: `/api/register/${registerType}`,
    enabled: !!currentRegister?.register_id,
    options: {
      method: 'POST',
      body: JSON.stringify({
        current_page: currentPage,
        page_size: pageSize,
        search_text: searchQuery,
        register_id: currentRegister?.register_id,
      }),
    },
  });

  const records = recordsData?.records ?? [];
  const paginationInfo = recordsData?.pagination;

  const pagination = useMemo<PaginationState>(() => {
    const totalPages = paginationInfo?.number_of_pages || 1;
    const totalItems = totalPages * pageSize;
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = (currentPage - 1) * pageSize + records.length;

    return {
      page: currentPage,
      limit: pageSize,
      total: totalItems,
      pageStart: startIndex,
      pageEnd: endIndex,
    };
  }, [paginationInfo, pageSize, currentPage, records.length]);

  const navigateToPage = useCallback(
    (targetPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(targetPage));
      router.push(`/register/${registerType}?${params}`);
    },
    [searchParams, router, registerType]
  );

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      navigateToPage(currentPage - 1);
    }
  }, [currentPage, navigateToPage]);

  const handleNextPage = useCallback(() => {
    const totalPages = paginationInfo?.number_of_pages || 1;
    if (currentPage < totalPages) {
      navigateToPage(currentPage + 1);
    }
  }, [currentPage, paginationInfo, navigateToPage]);

  const sortedDisplayFields = useCallback(
    (fields: DisplayField[]): DisplayField[] => {
      return [...fields].sort((a, b) => a.order - b.order);
    },
    []
  );


  return (
    <div className="min-h-screen mx-auto">
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

      <div className="px-6 py-4">
        <div className="border-b border-gray-200 mb-4">
          <SelectedFilters
            appliedFilters={appliedFilters}
            filterConfig={filterConfig}
            removeFilter={removeFilter}
            clearAllFilters={clearAllFilters}
          />
        </div>

        <div className="space-y-3">
          {isLoadingRecords ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No items found</div>
          ) : (
            records.map((record) => {
              const sortedFields = sortedDisplayFields(record.display_fields);

              return (
                <Link
                  key={record.internal_record_id}
                  href={`/register/${registerType}/${record.internal_record_id}`}
                  className="block"
                >
                  <div className="flex items-center gap-6 p-5 bg-white border-2 border-gray-300 rounded-md hover:shadow-sm hover:border-gray-400 transition-all">
                    {record.image ? (
                      <img
                        src={record.image}
                        alt={record.record_name}
                        className="w-16 h-16 rounded-md object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-300 rounded-md shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base mb-0.5">
                        {record.record_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        <span className="font-bold">ID :</span>{' '}
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
                          <p className="text-sm text-gray-900 truncate">
                            <span className="font-bold text-gray-600">
                              {firstField.field_name}:{' '}
                            </span>
                            <span className="font-bold">{firstField.value}</span>
                          </p>
                          {secondField && (
                            <p className="text-sm text-gray-900 truncate">
                              <span className="font-bold text-gray-600">
                                {secondField.field_name}:{' '}
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
