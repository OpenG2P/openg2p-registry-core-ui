'use client';

import { useMemo, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations();
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

  const registerTypeLabel = t(registerType) ?? currentRegister?.register_subject

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

  const handleSearch = useCallback((searchValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue.trim()) {
      params.set('search', searchValue.trim());
    } else {
      params.delete('search');
    }
    // reset page to 1 when search is applied
    params.set('page', '1');
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
        showSearch
        searchPlaceholder={`${searchQuery || t('search')}`}
        searchValue={searchQuery || ''}
        onSearch={handleSearch}
        pageStart={pagination.pageStart}
        pageEnd={pagination.pageEnd}
        total={pagination.total}
        onPrev={handlePreviousPage}
        onNext={handleNextPage}
        onApplyFilters={applyFilters}
        appliedFilters={appliedFilters}
        filterConfig={filterConfig}
      />

      <div className="mx-[30px] px-4 sm:px-6 lg:px-8 py-4 bg-white rounded-[30px]">

        <SelectedFilters
          appliedFilters={appliedFilters}
          filterConfig={filterConfig}
          removeFilter={removeFilter}
          clearAllFilters={clearAllFilters}
        />

        <div className="-mx-4 sm:-mx-6 lg:-mx-8 space-y-2">
          {isLoadingRecords ? (
            <div className="text-center py-10 text-gray-500">{t('loading')}</div>
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
                    {record.image ? (
                      <img
                        src={record.image}
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
