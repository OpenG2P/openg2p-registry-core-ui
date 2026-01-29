'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';

import { TopBar } from '@/components/shared';
import { IncomingMessageCardSkeleton, IncomingMessageList } from '@/features/messages/components';
import { useIncomingMessagesList } from '@/features/messages/hooks/useIncomingMessagesList';

export default function IncomingMessagesPage() {
    const router = useRouter();
    const t = useTranslations();

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || undefined;

    const {
        messages,
        loading,
        currentPage,
        pageSize,
        paginationInfo,
        onPrev,
        onNext,
    } = useIncomingMessagesList({
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
        router.push(`/incoming-messages?${params.toString()}`);
    }, [searchParams]);

    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4]">
            <TopBar
                breadcrumb={[{ label: 'Incoming Messages' }]}
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
                            <IncomingMessageCardSkeleton key={i} />
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-sm text-gray-400 text-center py-6">
                        No incoming messages found
                    </div>
                ) : (
                    <IncomingMessageList
                        messages={messages}
                    />
                )}
            </div>
        </div>
    );
}

