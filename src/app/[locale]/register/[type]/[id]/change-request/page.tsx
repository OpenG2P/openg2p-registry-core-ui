'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { RegisterTabsLayout } from '@/components/shared';
import { ChangeLogList, ChangeLogSkeleton } from '@/features/change-request/components';
import { useChangeRequestList } from '@/features/change-request/hooks/useChangeRequestList';
import { useLocale, useTranslations } from 'next-intl';
import { useRegister } from '@/context/RegisterContext';
import { useRegisterTabs } from '@/context/RegisterTabsContext';

interface BreadcrumbItem {
    label: string;
    href: string;
}

export default function ChangeRequestPage() {
    const t = useTranslations();
    const locale = useLocale();
    const { type, id } = useParams<{ type: string; id: string }>();
    const { currentRegister } = useRegister();

    const {
        tabs,
        activeTab,
        activeTabIndex,
        activeTabId,
        setActiveTabByIndex,
    } = useRegisterTabs();

    const { logs, loading } = useChangeRequestList({
        subjectId: id,
        tabId: activeTabId,
        enabled: !!activeTabId,
    });

    const breadcrumb = useMemo<BreadcrumbItem[]>(() => {
        if (!currentRegister) return [];
        const items: BreadcrumbItem[] = [
            {
                label:
                    t(currentRegister.register_subject) ??
                    currentRegister.register_subject,
                href: `/register/${type}`,
            },
            {
                label: `ID-${id}`,
                href: `/register/${type}/${id}`,
            },
        ];

        if (activeTab) {
            items.push({
                label: t(activeTab.tab_label) ?? activeTab.tab_label,
                href: '#',
            });
        }

        items.push({
            label: t('changeRequest') ?? 'Change Request',
            href: `/register/${type}/${id}/change-request`,
        });

        return items;
    }, [
        type,
        id,
        activeTabId,
        tabs,
        activeTabIndex,
        currentRegister,
        t,
    ]);

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
