import { useState } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { PopupType } from "@/features/change-request/types/change-request";

export const useChangeRequestActions = () => {
    const [loadingAction, setLoadingAction] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupType, setPopupType] = useState<PopupType | null>(null);

    const { execute: executeApprove } = useFetch()
    const { execute: executeReject } = useFetch();

    const handleApprove = async (changeRequestId: string) => {
        setLoadingAction(true);
        try {

            const res = await executeApprove(`/api/change_request/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    change_request_id: changeRequestId,
                })
            })

            if (res) {
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

    const submitReject = async (
        changeRequestId: string,
        reason: string
    ) => {
        setLoadingAction(true);
        try {
            const res = await executeReject(`/api/change_request/reject`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    change_request_id: changeRequestId,
                    rejection_reason: reason,
                })
            })

            if (res) {
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