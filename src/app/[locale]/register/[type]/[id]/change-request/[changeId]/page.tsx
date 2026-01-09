"use client";

import { useParams } from "next/navigation";
import { ChangeRequestDetailsView } from "@/features/change-request/components";
import { useRegister } from "@/context/RegisterContext";
import { useTranslations } from "next-intl";
import { useRegisterTabs } from "@/context/RegisterTabsContext";
import { useBreadcrumb } from "@/shared/hooks";

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

    const breadcrumb = useBreadcrumb({
        type,
        recordId: id,
        changeId,
        includeActiveTab: true,
        includeChangeRequest: true,
    });

    return (
        <ChangeRequestDetailsView
            changeId={changeId}
            breadcrumb={breadcrumb}
        />
    );
}
