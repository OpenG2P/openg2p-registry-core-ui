"use client";

import { useMemo, useState } from "react";

import { RegisterTabsLayout } from "@/components/shared";
import { ActionPopup, ChangeRequestHeader, RejectReasonPopup, VerificationForm, VerificationList } from "@/features/change-request/components";
import { useChangeRequest, useChangeRequestActions, useVerifications } from "@/features/change-request/hooks";

import {
    WidgetProvider,
    UISchema,
    createWidgetStore,
    SectionsContainer,
} from '@openg2p/registry-widgets';
import { useFetch } from "@/shared/hooks";
import { useTranslations } from "next-intl";

interface Props {
    changeId: string;
    breadcrumb: { label: string; href?: string }[];
}

interface SectionSchema {
    section_register_id: string;
    register_id: string;
    section_id: string;
    tab_id: string;
    section_mnemonic: string;
    section_description: string;
    documents_required: boolean;
    section_ui_schema: UISchema | null;
}

interface SectionsResponse {
    sections: SectionSchema[];
}

export default function ChangeRequestDetailsView({
    changeId,
    breadcrumb,
}: Props) {
    const t = useTranslations();
    const [showAddVerification, setShowAddVerification] = useState(false);

    const { details, loading } = useChangeRequest(changeId);
    const { verifications, addVerification } = useVerifications(changeId);
    const {
        loadingAction,
        popupVisible,
        popupType,
        handleApprove,
        handleReject,
        submitReject,
        setPopupVisible,
    } = useChangeRequestActions(changeId);

    const HARD_CODED_OLD_VALUES = {
        first_name: "Rajesh",
        last_name: "Kumar",
        national_id: "ABCD-1234-5678",
        gender: "male",
    };

    const HARD_CODED_NEW_VALUES = {
        first_name: "Rakesh",
        last_name: "Kumar",
        national_id: "ABCD-1234-5678",
        gender: "male",
    };


    // const type = details?.register_id
    // const activeTabId = details?.tab_id

    const type = "farmers"
    const activeTabId = "tab:farmer.profile"
    const sect_id = "farmer-register-001"


    const widgetStoreOld = useMemo(() => createWidgetStore(), []);
    const widgetStoreNew = useMemo(() => createWidgetStore(), []);

    const { data: sectionsSchema } = useFetch<SectionsResponse>({
        url: `/api/register/${type}/tabs/${activeTabId}/sections`,
        enabled: !!activeTabId,
    });


    const singleSectionConfig = useMemo(() => {
        if (!sectionsSchema || !details) return [];

        const sectionSchema = sectionsSchema.sections.find(
            s => s.section_register_id === sect_id
        );

        if (!sectionSchema?.section_ui_schema) return [];

        return sectionSchema.section_ui_schema.sections.filter(
            section => section["section-id"] === sect_id
        );
    }, [sectionsSchema, details]);


    const oldSectionData = useMemo<Record<string, any> | undefined>(() => {
        if (!details) return undefined;

        return {
            // [details.section_id]: HARD_CODED_OLD_VALUES,
            [sect_id]: HARD_CODED_OLD_VALUES,
        };
    }, [details]);

    const newSectionData = useMemo<Record<string, any> | undefined>(() => {
        if (!details) return undefined;

        return {
            [sect_id]: HARD_CODED_NEW_VALUES,
        };
    }, [details]);


    return (
        <RegisterTabsLayout breadcrumb={breadcrumb}>
            {loading && (
                <p className="text-sm text-gray-500">Loading change request…</p>
            )}

            {!loading && details && (
                <div className="flex gap-[30px]">
                    <div className="w-full lg:w-[75%]">
                        <ChangeRequestHeader
                            details={details}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            loadingAction={loadingAction}
                        />
                        <div className="px-2">
                            <h3 className="mt-6 mb-2 font-semibold">New Values</h3>
                            <WidgetProvider
                                store={widgetStoreNew}
                                schemaData={newSectionData}
                                translate={t}
                            >
                                <SectionsContainer sections={singleSectionConfig} />
                            </WidgetProvider>

                            <h3 className="mt-6 mb-2 font-semibold">Old Values</h3>
                            <WidgetProvider
                                store={widgetStoreOld}
                                schemaData={oldSectionData}
                                translate={t}
                            >
                                <SectionsContainer sections={singleSectionConfig} />
                            </WidgetProvider>
                        </div>
                    </div>

                    <div className="w-full lg:w-[25%]">
                        <VerificationList
                            verifications={verifications}
                            showForm={showAddVerification}
                            onToggleForm={() => setShowAddVerification((v) => !v)}
                            renderForm={() => (
                                <VerificationForm
                                    onSubmit={addVerification}
                                    onClose={() => setShowAddVerification(false)}
                                />
                            )}
                        />
                    </div>
                </div>
            )}

            {/* {popupVisible && popupType && (
                <ActionPopup
                    type={popupType}
                    onClose={() => setPopupVisible(false)}
                />
            )} */}
            {popupVisible && popupType === "reject-input" && (
                <RejectReasonPopup
                    onSubmit={submitReject}
                    onClose={() => setPopupVisible(false)}
                    loading={loadingAction}
                />
            )}

            {popupVisible && (popupType === "approve" || popupType === "reject") && (
                <ActionPopup
                    type={popupType}
                    onClose={() => setPopupVisible(false)}
                />
            )}

        </RegisterTabsLayout>
    );
}