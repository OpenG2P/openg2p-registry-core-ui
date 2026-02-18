'use client';

import { useParams } from 'next/navigation';
import { RegisterTabsLayout } from '@/components/shared';
import { ChangeLogList, ChangeLogSkeleton } from '@/features/change-request/components';
import { useChangeRequestList } from '@/features/change-request/hooks/useChangeRequestList';
import { useLocale, useTranslations } from 'next-intl';
import { useRegister } from '@/context/RegisterContext';
import { useRegisterTabs } from '@/context/RegisterTabsContext';
import { useBreadcrumb } from '@/shared/hooks';
import { useRegisterRecord } from '@/context/RegisterRecordContext';

export default function ChangeRequestPage() {
    const t = useTranslations();
    const locale = useLocale();
    const { type: registerType, id: internalRecordId } = useParams<{ type: string; id: string }>();
    const { currentRegister } = useRegister();

    const { functionalRecordId, recordName } = useRegisterRecord();

    const {
        tabs,
        activeTabIndex,
        activeTabId,
        setActiveTabByIndex,
    } = useRegisterTabs();

    const subjectRegisterId = currentRegister?.register_id;

    const { logs, loading } = useChangeRequestList({
        subjectRecordId: internalRecordId,
        subjectRegisterId: subjectRegisterId,
        tabId: activeTabId,
        enabled: !!activeTabId && !!internalRecordId && !!subjectRegisterId,
    });

    const breadcrumb = useBreadcrumb({
        registerType,
        functionalRecordId,
        recordName,
        internalRecordId,
        includeActiveTab: true,
        includeChangeRequest: true,
    });

    return (
        <RegisterTabsLayout
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
                            <ChangeLogSkeleton key={i} />
                        ))}
                    </div>
                </>
            ) : logs.length === 0 ? (
                <div className=" px-6 py-5 flex items-center justify-center text-center">
                    <div className="text-[16px] text-black/50 font-medium">
                        {t("noChangeRequest")}
                    </div>
                </div>

            ) : (
                <ChangeLogList
                    logs={logs}
                    getDetailsUrl={log =>
                        `/${locale}/register/${registerType}/${internalRecordId}/change-request/${log.change_request_id}?tab=${activeTabId}`
                    }
                />
            )}
        </RegisterTabsLayout>
    );
}
