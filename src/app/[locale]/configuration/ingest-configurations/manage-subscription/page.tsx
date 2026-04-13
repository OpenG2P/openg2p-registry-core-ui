'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TopBar } from '@/components/shared';
import { useAllSubscriptionActivityLogs, useSubscriptionActivityLog } from '@/features/configuration/shared';
import { usePagination } from '@/shared/hooks';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { useTranslations } from 'next-intl';
import { SubscriptionActivityLog } from '@/features/configuration/shared/hooks/useAllSubscriptionActivityLogs';
import AddSubscriptionActivityLogModal from '@/features/configuration/ingest/AddSubscriptionActivityLogModal';
import ViewSubscriptionActivityLogModal from '@/features/configuration/ingest/ViewSubscriptionActivityLogModal';

const ManageSubscriptionPage = () => {
    const t = useTranslations();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const { config } = useRuntimeConfig();

    const { activityLogs, pagination, loading, refresh } = useAllSubscriptionActivityLogs(currentPage, config.pageSize);
    const { selectedActivityLog, fetchActivityLog } = useSubscriptionActivityLog();

    const { pageStart, pageEnd, total } = usePagination({
        totalItems: pagination?.number_of_items || 0,
        currentPage: currentPage,
        pageSize: config?.pageSize || 10,
        currentCount: activityLogs.length,
    });

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const handleView = async (log: SubscriptionActivityLog) => {
        const result = await fetchActivityLog(log.subscription_activity_log_id);
        if (result) {
            setIsViewModalOpen(true);
        }
    };

    return (
        <>
            <TopBar
                breadcrumb={[{ label: t('ingest_configurations') }, { label: t('subscription_logs') }]}
                showFilters={false}
                showPagination
                showAddNewButton={true}
                addNewButtonText={t('add_subscription_log')}
                onAddNewButton={() => setIsAddModalOpen(true)}
                pageStart={pageStart}
                pageEnd={pageEnd}
                total={total}
                onPrev={handlePrev}
                onNext={handleNext}
            />

            <div className="mx-7.5 bg-white rounded-[10px] p-4 pt-8 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED7C22]"></div>
                    </div>
                ) : (
                    <div>
                        {/* Header */}
                        <div className="grid grid-cols-5 gap-4 pb-2 px-8">
                            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                                {t('log_id')}
                            </div>
                            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                                {t('partner_id')}
                            </div>
                            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                                {t('unsubscribe')}
                            </div>
                            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                                {t('date_time')}
                            </div>
                            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                                {t('actions')}
                            </div>
                        </div>

                        {/* Data Rows */}
                        {activityLogs.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                {t('no_items_found')}
                            </div>
                        ) : (
                            activityLogs.map((log: SubscriptionActivityLog, index: number) => (
                                <div key={log.subscription_activity_log_id} className="block -mx-8">
                                    <div
                                        className={`grid grid-cols-5 gap-4 items-center px-16 h-15 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'
                                            }`}
                                    >
                                        <div className="text-base font-medium truncate">
                                            {log.subscription_activity_log_id}
                                        </div>
                                        <div className="text-base font-medium truncate">
                                            {log.partner_id}
                                        </div>
                                        <div className="text-base font-medium">
                                            {log.is_unsubscribe ? t('true') : t('false')}
                                        </div>
                                        <div className="text-base font-medium truncate">
                                            {new Date(log.date_time).toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <button
                                                onClick={() => handleView(log)}
                                                className="flex items-center text-[#1cc9b7] cursor-pointer hover:opacity-80 transition-opacity"
                                                title={t('view')}
                                            >
                                                <span className="text-sm font-medium">{t('view')}</span>
                                                <Image
                                                    src="/images/common/view.png"
                                                    alt={t('view')}
                                                    width={18}
                                                    height={18}
                                                    className="ml-2"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <AddSubscriptionActivityLogModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={refresh}
            />

            <ViewSubscriptionActivityLogModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                data={selectedActivityLog}
            />
        </>
    );
};

export default ManageSubscriptionPage;
