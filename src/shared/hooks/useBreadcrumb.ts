import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRegister } from '@/context/RegisterContext';
import { useRegisterTabs } from '@/context/RegisterTabsContext';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbOptions {
    type: string;
    recordId?: string;
    changeId?: string;
    includeActiveTab?: boolean;
    includeChangeRequest?: boolean;
    customItems?: BreadcrumbItem[];
}

export function useBreadcrumb(options: BreadcrumbOptions) {
    const t = useTranslations();
    const { currentRegister } = useRegister();
    const { activeTab, activeTabId } = useRegisterTabs();

    const {
        type,
        recordId,
        changeId,
        includeActiveTab = false,
        includeChangeRequest = false,
        customItems = [],
    } = options;

    return useMemo<BreadcrumbItem[]>(() => {
        if (!currentRegister) return [];

        const items: BreadcrumbItem[] = [];

        items.push({
            label: t(currentRegister.register_subject) ?? currentRegister.register_subject,
            href: `/register/${type}`,
        });

        if (recordId) {
            items.push({
                label: `ID-${recordId}`,
                href: `/register/${type}/${recordId}`,
            });
        }

        if (includeActiveTab && activeTab) {
            items.push({
                label: t(activeTab.tab_label) ?? activeTab.tab_label,
                href: recordId
                    ? `/register/${type}/${recordId}?tab=${activeTab.tab_id}`
                    : '#',
            });
        }

        if (includeChangeRequest && recordId) {
            items.push({
                label: t('changeRequest') ?? 'Change Request',
                href: `/register/${type}/${recordId}/change-request${activeTabId ? `?tab=${activeTabId}` : ''}`,
            });
        }

        if (changeId && recordId) {
            items.push({
                label: changeId,
                href: `/register/${type}/${recordId}/change-request/${changeId}${activeTabId ? `?tab=${activeTabId}` : ''}`,
            });
        }

        items.push(...customItems);

        return items;
    }, [
        currentRegister,
        type,
        recordId,
        changeId,
        includeActiveTab,
        includeChangeRequest,
        activeTab,
        activeTabId,
        customItems,
        t,
    ]);
}