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
    recordId?: string | null;
    recordName?:string | null;
    internalId?: string | null;
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
        recordName,
        internalId,
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

        // Use internalId for href, recordId (functional) for label
        const displayId = recordId || t('functionalIdNotGenerated');
        const urlId = internalId || recordId;

        if (urlId) {
            items.push({
                label: recordId ? `${recordName} - ${recordId}` : displayId,
                href: `/register/${type}/${urlId}`,
            });
        }

        if (includeActiveTab && activeTab) {
            items.push({
                label: t(activeTab.tab_label) ?? activeTab.tab_label,
                href: urlId
                    ? `/register/${type}/${urlId}?tab=${activeTab.tab_id}`
                    : '#',
            });
        }

        if (includeChangeRequest && urlId) {
            items.push({
                label: t('changeRequest') ?? 'Change Request',
                href: `/register/${type}/${urlId}/change-request${activeTabId ? `?tab=${activeTabId}` : ''}`,
            });
        }

        if (changeId && urlId) {
            items.push({
                label: changeId,
                href: `/register/${type}/${urlId}/change-request/${changeId}${activeTabId ? `?tab=${activeTabId}` : ''}`,
            });
        }

        items.push(...customItems);

        return items;
    }, [
        currentRegister,
        type,
        recordId,
        internalId,
        changeId,
        includeActiveTab,
        includeChangeRequest,
        activeTab,
        activeTabId,
        customItems,
        t,
    ]);
}
