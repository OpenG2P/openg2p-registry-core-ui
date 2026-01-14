'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';

import { TopBar } from '@/components/shared';
import { SelectedFilters } from '@/features/filter/components';
import { useRegistryFilters } from '@/features/filter/hooks/useRegistryFilters';
import { OutgoingMessageCardSkeleton, OutgoingMessageList } from '@/features/messages/components';
import { useOutgoingMessagesList } from '@/features/messages/hooks';

export default function OutgoingMessagesPage() {
    const router = useRouter();
    const t = useTranslations();

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || undefined;

    const {
        appliedFilters,
        filterConfig,
        applyFilters,
        removeFilter,
        clearAllFilters,
    } = useRegistryFilters();

    const {
        messages,
        loading,
        currentPage,
        pageSize,
        paginationInfo,
        onPrev,
        onNext,
    } = useOutgoingMessagesList({
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
        router.push(`/outgoing-messages?${params.toString()}`);
    }, [searchParams]);

    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4]">
            <TopBar
                breadcrumb={[{ label: 'Outgoing Messages' }]}
                showFilters
                showPagination
                pageStart={pageStart}
                pageEnd={pageEnd}
                total={total}
                onPrev={onPrev}
                onNext={onNext}
                onApplyFilters={applyFilters}
                appliedFilters={appliedFilters}
                filterConfig={filterConfig}
            />

            <div className="px-7.5">
                <div className="pl-4 pr-2 mb-4 bg-white rounded-[30px]">
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

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <OutgoingMessageCardSkeleton key={i} />
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-sm text-gray-400 text-center py-6">
                        No outgoing messages found
                    </div>
                ) : (
                    <OutgoingMessageList messages={messages} />
                )}
            </div>
        </div>
    );
}
