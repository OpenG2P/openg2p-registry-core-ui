import { useState, useEffect, useCallback } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import type { ChangeRequest, Verification } from "@/features/change-request/types/change-request";
import { ChangeRequestDocument } from "../components/ChangeRequestHeader";

type PopupType = "approve" | "reject-input" | "reject" | null;

export function useChangeRequestManager(changeId: string) {
    const [details, setDetails] = useState<ChangeRequest | null>(null);
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [documents, setDocuments] = useState<ChangeRequestDocument[]>([]);

    const [loadingDetails, setLoadingDetails] = useState(true);
    const [loadingVerifications, setLoadingVerifications] = useState(true);
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

    const { data: verifData, loading: verificationsLoading } = useFetch<{ verifications: Verification[] }>({
        url: "/api/change_request/verification/list",
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
    const { execute: executeAddVerification } = useFetch();

    useEffect(() => {
        if (detailsData) setDetails(detailsData);
        setLoadingDetails(detailsLoading);
    }, [detailsData, detailsLoading]);

    useEffect(() => {
        if (verifData?.verifications) setVerifications(verifData.verifications);
        setLoadingVerifications(verificationsLoading)
    }, [verifData]);

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
            if (res) {
                setPopupType("approve");
                setPopupVisible(true);
                setDetails((prev) => {
                    if (!prev) return prev;
                    return { ...prev, approval_status: "APPROVED" };
                });
            }
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
                    setPopupType("reject");
                    setDetails((prev) => {
                        if (!prev) return prev;
                        return { ...prev, approval_status: "REJECTED" };
                    });
                }
            } finally {
                setLoadingAction(false);
            }
        },
        [changeId, executeReject]
    );

    const addVerification = useCallback(
        async (observation: string, isApproved: boolean) => {
            setLoadingAction(true);
            try {
                const result = await executeAddVerification("/api/change_request/verification/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        change_request_id: changeId,
                        verification_observations: observation,
                        is_approved: isApproved,
                    }),
                });

                const newVerification = result?.verification;
                if (newVerification) {
                    setVerifications((prev) => [newVerification, ...prev]);

                    setDetails((prev) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            no_of_verifications_done: (prev.no_of_verifications_done ?? 0) + 1,
                        };
                    });

                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error adding verification:", error);
                return false;
            } finally {
                setLoadingAction(false);
            }
        },
        [changeId, executeAddVerification]
    );

    return {
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
        handleReject: handleRejectClick,
        submitReject,
        addVerification,
    };
}
