import { useState, useCallback } from "react";
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

    const handleApprove = useCallback(async () => {
        setLoadingAction(true);
        try {
            const result = await executeApprove(
                `/api/change_request/approve`,
                createPostOptions(
                    createFullRequestBody({ change_request_id: changeId })
                )
            );

            if (result?.response_body?.response_payload) {
                setPopupType("approve");
                setPopupVisible(true);
            }
        } catch (e) {
            alert("Error approving change request");
        } finally {
            setLoadingAction(false);
        }
    }, [changeId, executeApprove]);

    const handleReject = useCallback(async () => {
        setLoadingAction(true);
        try {
            const result = await executeReject(
                `/api/change_request/reject`,
                createPostOptions(
                    createFullRequestBody({
                        change_request_id: changeId,
                        rejection_reason: "Rejected",
                    })
                )
            );

            if (result?.response_body?.response_payload) {
                setPopupType("reject");
                setPopupVisible(true);
            }
        } catch (e) {
            alert("Error rejecting change request");
        } finally {
            setLoadingAction(false);
        }
    }, [changeId, executeReject]);

    return {
        loadingAction,
        popupVisible,
        popupType,
        handleApprove,
        handleReject,
        setPopupVisible,
    };
};