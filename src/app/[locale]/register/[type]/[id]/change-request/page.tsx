'use client';

import { useParams } from 'next/navigation';
import { PaginationBar, TabsLayout } from '@/components/shared';
import { ChangeRequestList, ChangeRequestSkeleton } from '@/features/change-request/components';
import { useChangeRequestList } from '@/features/change-request/hooks/useChangeRequestList';
import { useLocale, useTranslations } from 'next-intl';
import { useRegister } from '@/context/RegisterContext';
import { useRegisterTabs } from '@/context/RegisterTabsContext';
import { useBreadcrumb, usePagination } from '@/shared/hooks';
import { useRegisterRecord } from '@/context/RegisterRecordContext';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';

export default function ChangeRequestPage() {
    const t = useTranslations();
    const locale = useLocale();
    const { type: registerType, id: internalRecordId } = useParams<{ type: string; id: string }>();
    const { currentRegister } = useRegister();
    const { config } = useRuntimeConfig();

    const { functionalRecordId, recordName } = useRegisterRecord();

    const {
        tabs,
        activeTabIndex,
        activeTabId,
        setActiveTabByIndex,
    } = useRegisterTabs();

    const subjectRegisterId = currentRegister?.register_id;
    const pageSize = config.pageSize || 10;

    const {
        changeRequests,
        loading,
        currentPage,
        paginationInfo,
        onPrev,
        onNext,
    } = useChangeRequestList({
        subjectRecordId: internalRecordId,
        subjectRegisterId: subjectRegisterId,
        tabId: activeTabId,
        pageSize,
        enabled: !!activeTabId && !!internalRecordId && !!subjectRegisterId,
    });

    // TODO: uncomment when pagination added to this page
    // const { pageStart, pageEnd, total } = usePagination({
    //     totalItems: paginationInfo?.number_of_items ?? 0,
    //     currentPage,
    //     pageSize,
    //     currentCount: changeRequests.length,
    // });

    const breadcrumb = useBreadcrumb({
        registerType,
        functionalRecordId,
        recordName,
        internalRecordId,
        includeActiveTab: true,
        includeChangeRequest: true,
    });

    return (<>

        <TabsLayout
            breadcrumb={breadcrumb}
            tabs={{ tabs }}
            activeTab={activeTabIndex}
            onTabChange={setActiveTabByIndex}
        >
            {loading ? (
                <>
                    {(tabs.length === 0 && <div className="flex gap-2 px-10">
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                className="h-10 w-32 rounded-t-[10px] bg-[#F2BA1A]/50"
                            />
                        ))}
                    </div>)}
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <ChangeRequestSkeleton key={i} />
                        ))}
                    </div>
                </>
            ) : changeRequests.length === 0 ? (
                <div className="px-6 py-5 flex items-center justify-center text-center">
                    <div className="text-[16px] text-black/50 font-medium">
                        {t("noChangeRequest")}
                    </div>
                </div>
            ) : (
                <>
                    <ChangeRequestList
                        changeRequests={changeRequests}
                        getDetailsUrl={changeRequest =>
                            `/${locale}/register/${registerType}/${internalRecordId}/change-request/${changeRequest.change_request_id}?tab=${activeTabId}`
                        }
                    />

                    {/* TODO: Place the pagination according to the design */}

                    {/* {total > 0 && (
                        <div className="flex justify-end px-6 py-4">
                            <PaginationBar
                                pageStart={pageStart}
                                pageEnd={pageEnd}
                                total={total}
                                onPrev={onPrev}
                                onNext={onNext}
                            />
                        </div>
                    )} */}

                </>
            )}
        </TabsLayout>

    </>


    );
}
