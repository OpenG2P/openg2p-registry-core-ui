"use client";

import { useMemo, useState } from "react";

import { RegisterTabsLayout } from "@/components/shared";
import { ActionPopup, ChangeRequestHeader, RejectReasonPopup, VerificationForm, VerificationList } from "@/features/change-request/components";
import { useChangeRequest, useChangeRequestActions, useVerifications } from "@/features/change-request/hooks";

import {
    WidgetProvider,
    createWidgetStore,
    SectionsContainer,
} from '@openg2p/registry-widgets';
import { useTranslations } from "next-intl";
import { useChangeRequestDocuments } from "../hooks/useChangeRequestDocuments";
import { useRegisterSectionsFromCR } from "./useRegisterSectionsFromCR";
import { RegisterFlattenedRecord } from "@/features/register/types";

interface Props {
    changeId: string;
    breadcrumb: { label: string; href?: string }[];
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
    } = useChangeRequestActions();


    const { documents, loading: loadingDocs } = useChangeRequestDocuments(changeId);

    const widgetStoreOld = useMemo(() => createWidgetStore(), []);
    const widgetStoreNew = useMemo(() => createWidgetStore(), []);

    const registerId = details?.register_id;
    const tabId = details?.tab_id;
    const internalRecordId = details?.internal_record_id;
    const sectionId = details?.section_id;


    const {
        orderedTabSections,
    } = useRegisterSectionsFromCR({
        registerId,
        tabId,
        internalRecordId,
    });

    const innerSectionConfig = useMemo(() => {
        if (!orderedTabSections) return [];

        return orderedTabSections.filter(
            (section: any) =>
                section["section-id"] === sectionId
        );
    }, [orderedTabSections, sectionId]);

    const newSectionData = useMemo(() => {
        if (!details?.change_payload?.length) return undefined;

        const map: Record<
            string,
            RegisterFlattenedRecord | { records: RegisterFlattenedRecord[] }
        > = {};

        map["755a038e-3d98-4694-bb2d-ed93e30f9a1b"] =
            details.change_payload.length === 1
                ? details.change_payload[0]
                : { records: details.change_payload };

        return map;
    }, [details]);


    const oldSectionData = useMemo(() => {
        if (!details?.current_register_data) return undefined;

        const map: Record<string, RegisterFlattenedRecord> = {};

        map[registerId || ''] = details.current_register_data;

        return map;
    }, [details, registerId]);


    return (
        <RegisterTabsLayout breadcrumb={breadcrumb}>
            {loading && (
                <p className="text-sm text-gray-500">Loading change request…</p>
            )}

            {!loading && details && (
                <div className="flex gap-7.5">
                    <div className="w-full lg:w-[75%]">
                        <ChangeRequestHeader
                            details={details}
                            documents={documents}
                            onApprove={() => handleApprove(changeId)}
                            onReject={handleReject}
                            loadingAction={loadingAction}
                        />

                        <div>
                            <h3 className="mt-6 mb-2 font-semibold">New Values</h3>
                            <WidgetProvider
                                store={widgetStoreNew}
                                schemaData={newSectionData}
                                translate={t}
                            >
                                <SectionsContainer sections={innerSectionConfig} hideEditButton={true} />
                            </WidgetProvider>

                            <h3 className="mt-6 mb-2 font-semibold">Old Values</h3>
                            <WidgetProvider
                                store={widgetStoreOld}
                                schemaData={oldSectionData}
                                translate={t}
                            >
                                <SectionsContainer sections={innerSectionConfig} hideEditButton={true} />
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

            {popupVisible && popupType === "reject-input" && (
                <RejectReasonPopup
                    onSubmit={(reason) => submitReject(changeId, reason)}
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