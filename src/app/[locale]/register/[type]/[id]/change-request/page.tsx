'use client';

import { useParams } from 'next/navigation';
import { RegisterTabsLayout } from '@/components/shared';
import { ChangeLogList, ChangeLogSkeleton } from '@/features/change-request/components';
import { useChangeRequestList } from '@/features/change-request/hooks/useChangeRequestList';
import { useLocale, useTranslations } from 'next-intl';
import { useRegister } from '@/context/RegisterContext';
import { useRegisterTabs } from '@/context/RegisterTabsContext';
import { useBreadcrumb } from '@/shared/hooks';

export default function ChangeRequestPage() {
    const t = useTranslations();
    const locale = useLocale();
    const { type, id } = useParams<{ type: string; id: string }>();
    const { currentRegister } = useRegister();

    const {
        tabs,
        activeTabIndex,
        activeTabId,
        setActiveTabByIndex,
    } = useRegisterTabs();

    const subjectRegisterId = currentRegister?.register_id;

    const { logs, loading } = useChangeRequestList({
        subjectRecordId: id,
        subjectRegisterId: subjectRegisterId,
        tabId: activeTabId,
        enabled: !!activeTabId && !!id && !!subjectRegisterId,
    });

    const breadcrumb = useBreadcrumb({
        type,
        recordId: id,
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
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <ChangeLogSkeleton key={i} />
                    ))}
                </div>
            ) : logs.length === 0 ? (
                <p className="text-sm text-gray-400">No change requests found</p>
            ) : (
                <ChangeLogList
                    logs={logs}
                    getDetailsUrl={log =>
                        `/${locale}/register/${type}/${id}/change-request/${log.change_request_id}?tab=${activeTabId}`
                    }
                />
            )}
        </RegisterTabsLayout>
    );
}
