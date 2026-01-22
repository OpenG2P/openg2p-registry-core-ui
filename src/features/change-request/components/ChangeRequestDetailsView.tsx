"use client";

import { useMemo, useState } from "react";

import { RegisterTabsLayout } from "@/components/shared";
import {
    ActionPopup,
    ChangeRequestHeader,
    RejectReasonPopup,
    VerificationForm,
    VerificationList,
} from "@/features/change-request/components";


import {
    WidgetProvider,
    createWidgetStore,
    SectionsContainer,
} from "@openg2p/registry-widgets";
import { useTranslations } from "next-intl";
import { RegisterFlattenedRecord } from "@/features/register/types";
import { useChangeRequestManager, useRegisterSectionsFromCR } from "@/features/change-request/hooks";
import { ChangeRequestValuesTabs } from "./ChangeRequestValuesTabs";
import CRHeaderSkeleton from "./CRHeaderSkeleton";
import SectionSchemaSkeleton from "./SectionSchemaSkeleton";
import VerificationListSkeleton from "./VerificationListSkeleton";

interface Props {
    changeId: string;
    breadcrumb: { label: string; href?: string }[];
}

export default function ChangeRequestDetailsView({ changeId, breadcrumb }: Props) {
    const t = useTranslations();
    const [showAddVerification, setShowAddVerification] = useState(false);

    const {
        details,
        verifications,
        documents,
        loadingDetails,
        loadingVerifications,
        loadingDocuments,
        loadingAction,
        popupVisible,
        popupType,
        setPopupVisible,
        handleApprove,
        handleReject,
        submitReject,
        addVerification,
    } = useChangeRequestManager(changeId);

    const widgetStoreOld = useMemo(() => createWidgetStore(), []);
    const widgetStoreNew = useMemo(() => createWidgetStore(), []);

    const registerId = details?.register_id;
    const tabId = details?.tab_id;
    const internalRecordId = details?.internal_record_id;
    const sectionId = details?.section_id;
    const sectionRegisterId = details?.section_register_id || "";
    const isListSection = details?.is_list || false;

    const { orderedTabSections, loadingSchema } = useRegisterSectionsFromCR({
        registerId,
        tabId,
        internalRecordId,
    });

    const innerSectionConfig = useMemo(() => {
        if (!orderedTabSections) return [];

        return orderedTabSections.filter(
            (section: any) => section["section-id"] === sectionId
        );
    }, [orderedTabSections, sectionId]);

    const newSectionData = useMemo(() => {
        if (!details?.change_payload?.length) return undefined;

        const map: Record<
            string,
            RegisterFlattenedRecord | { records: RegisterFlattenedRecord[] }
        > = {};

        if (isListSection === true) {
            map[sectionRegisterId] = {
                records: details.change_payload,
            };
        } else {
            map[sectionRegisterId] = details.change_payload[0];
        }

        return map;
    }, [details]);

    const oldSectionData = useMemo(() => {
        if (!details?.current_register_data?.length) return undefined;

        const map: Record<
            string,
            RegisterFlattenedRecord | { records: RegisterFlattenedRecord[] }
        > = {};

        if (isListSection === true) {
            map[sectionRegisterId] = {
                records: details.current_register_data,
            };
        } else {
            map[sectionRegisterId] = details.current_register_data[0];
        }

        return map;
    }, [details, isListSection, sectionRegisterId]);

    return (
        <RegisterTabsLayout breadcrumb={breadcrumb}>
            <div className="flex gap-7.5">
                <div className="w-full lg:w-[75%]">
                    {loadingDetails || loadingDocuments ? (
                        <CRHeaderSkeleton />
                    ) : (
                        details && (
                            <ChangeRequestHeader
                                details={details}
                                documents={documents}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                loadingAction={loadingAction}
                            />
                        )
                    )}

                    {loadingSchema ? (
                        <SectionSchemaSkeleton />
                    ) : (
                        details && (
                            <ChangeRequestValuesTabs
                                widgetStoreNew={widgetStoreNew}
                                widgetStoreOld={widgetStoreOld}
                                newSectionData={newSectionData}
                                oldSectionData={oldSectionData}
                                innerSectionConfig={innerSectionConfig}
                                t={t}
                            />
                        )
                    )}
                </div>

                <div className="w-full lg:w-[25%]">
                    {loadingVerifications ? (
                        <VerificationListSkeleton />
                    ) : (
                        <VerificationList
                            verifications={verifications}
                            showForm={showAddVerification}
                            onToggleForm={() => setShowAddVerification(v => !v)}
                            renderForm={() => (
                                <VerificationForm
                                    onSubmit={addVerification}
                                    onClose={() => setShowAddVerification(false)}
                                />
                            )}
                            isPending={details?.approval_status === "PENDING"}
                        />
                    )}
                </div>
            </div>
            {popupVisible && popupType === "reject-input" && (
                <RejectReasonPopup
                    onSubmit={(reason) => submitReject(reason)}
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
