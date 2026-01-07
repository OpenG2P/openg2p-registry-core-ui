"use client";

import { useState } from "react";

import { RegisterTabsLayout } from "@/components/shared";
import { ActionPopup, ChangeRequestHeader, VerificationForm, VerificationList } from "@/features/change-request/components";
import { useChangeRequest, useChangeRequestActions, useVerifications } from "@/features/change-request/hooks";

interface Props {
    changeId: string;
    breadcrumb: { label: string; href?: string }[];
}

export default function ChangeRequestDetailsView({
    changeId,
    breadcrumb,
}: Props) {
    const [showAddVerification, setShowAddVerification] = useState(false);

    const { details, loading } = useChangeRequest(changeId);
    const { verifications, addVerification } = useVerifications(changeId);
    const {
        loadingAction,
        popupVisible,
        popupType,
        handleApprove,
        handleReject,
        setPopupVisible,
    } = useChangeRequestActions(changeId);

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

            {popupVisible && popupType && (
                <ActionPopup
                    type={popupType}
                    onClose={() => setPopupVisible(false)}
                />
            )}
        </RegisterTabsLayout>
    );
}