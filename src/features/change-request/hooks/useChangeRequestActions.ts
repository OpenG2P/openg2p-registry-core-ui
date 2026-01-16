import { useState } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { PopupType } from "@/features/change-request/types/change-request";
import { createFullRequestBody, createPostOptions } from "@/features/change-request/utils/api";

export const useChangeRequestActions = (changeId: string) => {
    const [loadingAction, setLoadingAction] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupType, setPopupType] = useState<PopupType | null>(null);

    const { execute: executeApprove } = useFetch<any>({
        url: `/api/change_request/approve`,
        enabled: false,
    });

    const { execute: executeReject } = useFetch<any>({
        url: `/api/change_request/reject`,
        enabled: false,
    });

    const handleApprove = async () => {
        setLoadingAction(true);
        try {
            const res = await executeApprove(
                `/api/change_request/approve`,
                createPostOptions(
                    createFullRequestBody({ change_request_id: changeId })
                )
            );

            if (res?.response_body?.response_payload) {
                setPopupType("approve");
                setPopupVisible(true);
            }
        } finally {
            setLoadingAction(false);
        }
    };

    const handleRejectClick = () => {
        setPopupType("reject-input");
        setPopupVisible(true);
    };

    const submitReject = async (reason: string) => {
        setLoadingAction(true);
        try {
            const res = await executeReject(
                `/api/change_request/reject`,
                createPostOptions(
                    createFullRequestBody({
                        change_request_id: changeId,
                        rejection_reason: reason,
                    })
                )
            );

            if (res?.response_body?.response_payload) {
                setPopupType("reject");
            }
        } finally {
            setLoadingAction(false);
        }
    };

    return {
        loadingAction,
        popupVisible,
        popupType,
        handleApprove,
        handleReject: handleRejectClick,
        submitReject,
        setPopupVisible,
    };
};