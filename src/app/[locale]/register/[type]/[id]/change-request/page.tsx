'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { RegisterTabsLayout } from '@/components/shared';
import { useFetch } from '@/shared/hooks';
import { ChangeLogList } from '@/features/change-request/components';
import { useChangeRequestList } from '@/features/change-request/hooks/useChangeRequestList';
import { useLocale } from 'next-intl';
import { TabsResponse } from '@/shared/types';

export default function ChangeRequestPage() {
    const locale = useLocale();
    const { type, id } = useParams<{ type: string; id: string }>();
    const router = useRouter();
    const searchParams = useSearchParams();

    const tabFromUrl = searchParams.get('tab');
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    const { data: tabsData } = useFetch<TabsResponse>({
        url: `/api/register/${type}/tabs`,
    });

    useEffect(() => {
        if (!tabsData?.tabs || !tabFromUrl) return;
        const index = tabsData.tabs.findIndex(t => t.tab_id === tabFromUrl);
        if (index >= 0) setActiveTabIndex(index);
    }, [tabsData, tabFromUrl]);

    const activeTabId = tabsData?.tabs?.[activeTabIndex]?.tab_id;

    const { logs, loading } = useChangeRequestList({
        subjectId: id,
        tabId: activeTabId,
        enabled: !!activeTabId,
    });

    const handleTabChange = useCallback(
        (index: number) => {
            const tabId = tabsData?.tabs?.[index]?.tab_id;
            if (!tabId) return;

            setActiveTabIndex(index);
            router.push(`/register/${type}/${id}/change-request?tab=${tabId}`);
        },
        [tabsData, router, type, id]
    );

    const breadcrumb = useMemo(
        () => [
            { label: 'Register', href: `/register/${type}` },
            { label: `ID-${id}`, href: `/register/${type}/${id}` },
            ...(activeTabId
                ? [{ label: tabsData?.tabs?.[activeTabIndex]?.tab_label }]
                : []),
            { label: 'Change Request' },
        ],
        [type, id, activeTabId, tabsData, activeTabIndex]
    );

    return (
        <RegisterTabsLayout
            breadcrumb={breadcrumb}
            tabs={tabsData}
            activeTab={activeTabIndex}
            onTabChange={handleTabChange}
        >
            {loading ? (
                <p className="text-sm text-gray-500">Loading…</p>
            ) : logs.length === 0 ? (
                <p className="text-sm text-gray-400">No change requests found</p>
            ) : (
                <ChangeLogList
                    logs={logs}
                    getDetailsUrl={log =>
                        `/${locale}/register/${type}/${id}/change-request/${log.change_request_id}`
                    }
                />
            )}
        </RegisterTabsLayout>
    );
}
