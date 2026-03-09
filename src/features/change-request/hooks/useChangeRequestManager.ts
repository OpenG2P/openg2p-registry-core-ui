import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useFetch } from "@/shared/hooks/useFetch";
import type { ChangeRequest } from "@/features/change-request/types/change-request";
import { ChangeRequestDocument } from "../components/ChangeRequestHeader";

type PopupType = "approve" | "reject-input" | "reject" | null;

export function useChangeRequestManager(changeId: string) {
    const [details, setDetails] = useState<ChangeRequest | null>(null);
    const [documents, setDocuments] = useState<ChangeRequestDocument[]>([]);

    const [loadingDetails, setLoadingDetails] = useState(true);
    const [loadingDocuments, setLoadingDocuments] = useState(true);
    const [loadingAction, setLoadingAction] = useState(false);

    const [popupVisible, setPopupVisible] = useState(false);
    const [popupType, setPopupType] = useState<PopupType>(null);

    const { data: detailsData, loading: detailsLoading } = useFetch<ChangeRequest>({
        url: "/api/change_request/get",
        enabled: !!changeId,
        options: {
            method: "POST",
            body: JSON.stringify({ change_request_id: changeId }),
        },
    });

    const { data: documentsData, loading: documentsLoading } = useFetch<{ documents: ChangeRequestDocument[] }>({
        url: "/api/change_request/get_documents",
        enabled: !!changeId,
        options: {
            method: "POST",
            body: JSON.stringify({ change_request_id: changeId }),
        },
    });

    const { execute: executeApprove } = useFetch();
    const { execute: executeReject } = useFetch();

    useEffect(() => {
        if (detailsData) setDetails(detailsData);
        setLoadingDetails(detailsLoading);
    }, [detailsData, detailsLoading]);

    useEffect(() => {
        if (documentsData?.documents) setDocuments(documentsData.documents);
        setLoadingDocuments(documentsLoading)
    }, [documentsData]);

    const handleApprove = useCallback(async () => {
        setLoadingAction(true);
        try {
            const res = await executeApprove("/api/change_request/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ change_request_id: changeId }),
            });

            if ("error" in res) {
                toast.error(res.error, {
                    position: "top-right",
                    autoClose: 5000,
                });
                return;
            }
            if (res.approval_status === "APPROVED") {
                toast.success("Change request approved successfully", {
                    position: "top-right",
                    autoClose: 4000,
                });

                setDetails(prev => {
                    if (!prev) return prev;
                    return { ...prev, approval_status: "APPROVED" };
                });
            }
        } catch {
            toast.error("Failed to approve change request", {
                autoClose: 5000,
            });
        } finally {
            setLoadingAction(false);
        }
    }, [changeId, executeApprove]);

    const handleRejectClick = useCallback(() => {
        setPopupType("reject-input");
        setPopupVisible(true);
    }, []);

    const submitReject = useCallback(
        async (reason: string) => {
            setLoadingAction(true);
            try {
                const res = await executeReject("/api/change_request/reject", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ change_request_id: changeId, rejection_reason: reason }),
                });
                if (res) {
                    setPopupVisible(false);

                    toast.success("Change request rejected", {
                        position: "top-right",
                        autoClose: 4000,
                    });

                    setDetails((prev) => {
                        if (!prev) return prev;
                        return { ...prev, approval_status: "REJECTED" };
                    });
                }
            } catch {
                toast.error("Failed to reject change request", {
                    autoClose: 5000,
                });
            } finally {
                setLoadingAction(false);
            }
        },
        [changeId, executeReject]
    );

    return {
        details,
        documents,
        loadingDetails,
        loadingDocuments,
        loadingAction,
        popupVisible,
        popupType,
        setPopupVisible,
        handleApprove,
        handleReject: handleRejectClick,
        submitReject,
    };
}
