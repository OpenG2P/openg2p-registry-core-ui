"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ChangeRequestDetailsView } from "@/features/change-request/components";
import { useRegister } from "@/context/RegisterContext";
import { useTranslations } from "next-intl";
import { useRegisterTabs } from "@/context/RegisterTabsContext";

interface BreadcrumbItem {
    label: string;
    href: string;
}

export default function RegisterChangeRequestDetailsPage() {
    const t = useTranslations();

    const { type, id, changeId } = useParams<{
        type: string;
        id: string;
        changeId: string;
    }>();

    const { currentRegister } = useRegister();

    const {
        activeTab,
        activeTabIndex,
        activeTabId
    } = useRegisterTabs();

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
                href: `/register/${type}/${id}/change-request?tab=${activeTab.tab_id}`,
            });
        }

        items.push(
            {
                label: t('changeRequest') ?? 'Change Request',
                href: `/register/${type}/${id}/change-request`,
            },
            {
                label: changeId,
                href: `/register/${type}/${id}/change-request/${changeId}?tab=${activeTabId ?? ''}`,
            }
        );

        return items;
    }, [
        currentRegister,
        type,
        id,
        changeId,
        activeTab,
        activeTabId,
        t,
    ]);

    return (
        <ChangeRequestDetailsView
            changeId={changeId}
            breadcrumb={breadcrumb}
        />
    );
}
