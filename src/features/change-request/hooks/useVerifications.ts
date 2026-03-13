import { useState, useEffect, useCallback } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { toast } from "react-toastify";
import { Verification } from "@/features/change-request/types/change-request";

export const useVerifications = (changeId?: string, intakeFormSubmissionId?: string) => {
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [loadingVerifications, setLoadingVerifications] = useState(true);

    const { data: verificationResp, loading: verificationsLoading } = useFetch<any>({
        url: `/api/verification/list`,
        enabled: !!changeId || !!intakeFormSubmissionId,
        options: {
            method: "POST",
            body: JSON.stringify({
                change_request_id: changeId ?? "",
                submission_id: intakeFormSubmissionId ?? "",
            }),
        },
    });

    const { execute: executeCreate } = useFetch<any>({
        url: `/api/verification/create`,
        enabled: false,
    });

    useEffect(() => {
        setVerifications([]);
    }, [changeId]);

    useEffect(() => {
        if (verificationResp?.verifications) {
            setVerifications(verificationResp.verifications);
        }
        setLoadingVerifications(verificationsLoading)
    }, [verificationResp]);

    const addVerification = useCallback(
        async (observation: string, isApproved: boolean) => {
            try {
                const result = await executeCreate(
                    `/api/verification/create`,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            change_request_id: changeId ?? "",
                            submission_id: intakeFormSubmissionId ?? "",
                            verification_observations: observation,
                            is_approved: isApproved,
                        }),
                    }
                );

                const newVerification = result?.verification;

                if (newVerification) {
                    setVerifications((prev) => [newVerification, ...prev]);
                    toast.success("Verification added successfully", {
                        position: "top-right",
                        autoClose: 4000,
                    });
                    return true;
                }
                return false;
            } catch (error) {
                toast.error("Something went wrong while adding verification", {
                    autoClose: 5000,
                });
                return false;
            }
        },
        [changeId, executeCreate]
    );

    return { verifications, loadingVerifications, addVerification };
};