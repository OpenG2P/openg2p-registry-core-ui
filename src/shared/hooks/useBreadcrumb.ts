import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRegister } from '@/context/RegisterContext';
import { useRegisterTabs } from '@/context/RegisterTabsContext';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbOptions {
    registerType: string;
    functionalRecordId?: string | null;
    recordName?: string | null;
    internalRecordId?: string | null;
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
        registerType,
        functionalRecordId,
        recordName,
        internalRecordId,
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
            href: `/register/${registerType}`,
        });

        if (internalRecordId && activeTab) {
            items.push({
                label: `${recordName} - ${functionalRecordId} - ${t(activeTab.tab_label) ?? activeTab.tab_label}`,
                href: `/register/${registerType}/${internalRecordId}`,
            });
        }

        if (includeChangeRequest && internalRecordId) {
            items.push({
                label: t('changeRequest') ?? 'Change Request',
                href: `/register/${registerType}/${internalRecordId}/change-request${activeTabId ? `?tab=${activeTabId}` : ''}`,
            });
        }

        if (changeId && internalRecordId) {
            items.push({
                label: changeId,
                href: `/register/${registerType}/${internalRecordId}/change-request/${changeId}${activeTabId ? `?tab=${activeTabId}` : ''}`,
            });
        }

        items.push(...customItems);

        return items;
    }, [
        currentRegister,
        registerType,
        functionalRecordId,
        internalRecordId,
        changeId,
        includeActiveTab,
        includeChangeRequest,
        activeTab,
        activeTabId,
        customItems,
        recordName,
        t,
    ]);
}
